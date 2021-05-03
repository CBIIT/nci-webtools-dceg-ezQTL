const express = require('express');
const compression = require('compression');
const config = require('../config');
const logger = require('./logger');
const path = require('path');
const {
  qtlsCalculateMain,
  qtlsCalculateLocusAlignmentBoxplots,
  qtlsCalculateLocusColocalizationHyprcolocLD,
  qtlsCalculateLocusColocalizationHyprcoloc,
  qtlsCalculateLocusColocalizationECAVIAR,
  qtlsCalculateQC,
  qtlsCalculateLD,
  qtlsColocVisualize,
} = require('./calculate');
const apiRouter = express.Router();
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');
const tar = require('tar');
const { validate } = require('uuid');

const dataDir = path.resolve(config.data.folder);
const tmpDir = path.resolve(config.tmp.folder);
const awsInfo = config.aws;
const workingDirectory = path.resolve(config.R.workDir);

AWS.config.update(awsInfo);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { request_id } = req.body;
    const uploadDir = path.resolve(tmpDir, request_id);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

apiRouter.use('/results', express.static(config.tmp.folder));

// parse json requests
apiRouter.use(express.json({ limit: '10mb' }));

// compress all responses
apiRouter.use(compression());

// add cache-control headers to GET requests
apiRouter.use((request, response, next) => {
  if (request.method === 'GET')
    response.set(`Cache-Control', 'public, max-age=${60 * 60}`);
  next();
});

// healthcheck route
apiRouter.get('/ping', (request, response) => {
  response.status(200);
  response.json('true');
});

// file upload route
apiRouter.post('/file-upload', upload.any(), async (req, res) => {
  logger.info(`[${req.body.request_id}] Execute /file-upload`);
  logger.debug(
    `[${req.body.request_id}] Parameters ${JSON.stringify(
      req.body,
      undefined,
      4
    )}`
  );
  try {
    logger.info(`[${req.body.request_id}] Finished /file-upload`);
    res.json({
      files: req.files,
      body: req.body,
    });
  } catch (err) {
    logger.error(`[${req.body.request_id}] Error /file-upload ${err}`);
    res.status(500).json(err);
  }
});

// calculation routes
apiRouter.post('/qtls-calculate-main', (req, res, next) =>
  qtlsCalculateMain(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    req,
    res,
    next
  )
);

// get list of public GTEx data
apiRouter.post('/getPublicGTEx', async (req, res, next) => {
  try {
    let buffers = [];
    const filestream = new AWS.S3({
      accessKeyId: awsInfo.aws_access_key_id,
      secretAccessKey: awsInfo.aws_secret_access_key,
    })
      .getObject({
        Bucket: awsInfo.s3.data,
        Key: `${awsInfo.s3.subFolder}/vQTL2_resource.xlsx`,
      })
      .createReadStream();

    filestream
      .on('data', (data) => buffers.push(data))
      .on('end', () => {
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheetNames = workbook.SheetNames;
        const data = sheetNames.reduce(
          (acc, sheet) => ({
            ...acc,
            [sheet]: XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
          }),
          {}
        );

        res.json(data);
      })
      .on('error', next);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

apiRouter.post('/queue', async (req, res, next) => {
  const params = req.body;
  const request = params.request;
  const sqs = new AWS.SQS();
  const wd = path.join(tmpDir, '/', request);

  if (!fs.existsSync(wd)) {
    fs.mkdirSync(wd);
  }

  try {
    logger.info(`Uploading: ${fs.readdirSync(wd)}`);
    await new AWS.S3()
      .upload({
        Body: tar.c({ sync: true, gzip: true, C: tmpDir }, [request]).read(),
        Bucket: awsInfo.s3.queue,
        Key: `${awsInfo.s3.inputPrefix}/${request}/${request}.tgz`,
      })
      .promise();

    const { QueueUrl } = await sqs
      .getQueueUrl({ QueueName: awsInfo.sqs.url })
      .promise();

    await sqs
      .sendMessage({
        QueueUrl: QueueUrl,
        MessageDeduplicationId: request,
        MessageGroupId: request,
        MessageBody: JSON.stringify({
          ...params,
          multi: false,
          timestamp: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
          }),
        }),
      })
      .promise();

    logger.info('Queue submitted request: ' + request);
    res.json({ request });
  } catch (err) {
    logger.info('Queue failed to submit request: ' + request);
    next(err);
  }
});

apiRouter.post('/queue-multi', async (req, res, next) => {
  const { paramsArr, requests, email } = req.body;
  const sqs = new AWS.SQS();

  // upload each request and accompanying data
  requests.forEach(async (request) => {
    const wd = path.join(tmpDir, '/', request);

    if (!fs.existsSync(wd)) {
      fs.mkdirSync(wd);
    }

    try {
      logger.info(`Uploading: ${fs.readdirSync(wd)}`);
      await new AWS.S3()
        .upload({
          Body: tar.c({ sync: true, gzip: true, C: tmpDir }, [request]).read(),
          Bucket: awsInfo.s3.queue,
          Key: `${awsInfo.s3.inputPrefix}/${request}/${request}.tgz`,
        })
        .promise();
    } catch (err) {
      logger.info('QueueMulti failed to upload request: ' + request);
      next(err);
    }
  });

  try {
    const { QueueUrl } = await sqs
      .getQueueUrl({ QueueName: awsInfo.sqs.url })
      .promise();

    await sqs
      .sendMessage({
        QueueUrl: QueueUrl,
        MessageDeduplicationId: requests[0],
        MessageGroupId: requests[0],
        MessageBody: JSON.stringify({
          ...req.body,
          multi: true,
          timestamp: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
          }),
        }),
      })
      .promise();

    logger.info('QueueMulti submitted request: ' + requests[0]);
    res.json({ requests });
  } catch (err) {
    logger.info('QueueMulti failed to submit queue request: ' + requests[0]);
    next(err);
  }
});

apiRouter.post('/fetch-results', async (req, res, next) => {
  try {
    const s3 = new AWS.S3();
    const { request } = req.body;

    logger.info(`Fetch Queue Result: ${request}`);

    // validate request format
    if (!validate(request.substring(0, 36))) throw `Invalid request`;

    // ensure output directory exists
    const resultsFolder = path.resolve(config.tmp.folder, request);
    await fs.promises.mkdir(resultsFolder, { recursive: true });

    // find objects which use the specified request as the prefix
    const objects = await s3
      .listObjectsV2({
        Bucket: config.aws.s3.queue,
        Prefix: `${config.aws.s3.outputPrefix}/${request}/`,
      })
      .promise();

    // download results
    for (let { Key } of objects.Contents) {
      const filename = path.basename(Key);
      const filepath = path.resolve(resultsFolder, filename);

      // download results if they do not exist
      if (!fs.existsSync(filepath)) {
        logger.info(`Downloading result: ${Key}`);
        const object = await s3
          .getObject({
            Bucket: config.aws.s3.queue,
            Key,
          })
          .promise();

        await fs.promises.writeFile(filepath, object.Body);
        // extract and delete archive
        if (path.extname(filename) == '.tgz') {
          await new Promise((resolve, reject) => {
            fs.createReadStream(filepath)
              .on('end', () =>
                fs.unlink(filepath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                })
              )
              .pipe(tar.x({ strip: 1, C: resultsFolder }));
          });
        }
      }
    }

    let paramsFilePath = path.resolve(resultsFolder, `params.json`);

    if (fs.existsSync(paramsFilePath)) {
      const params = JSON.parse(
        String(await fs.promises.readFile(paramsFilePath))
      );

      res.json(params);
    } else {
      throw `Invalid request`;
    }
  } catch (error) {
    next(error);
  }
});

// download work session
apiRouter.post('/locus-download', (req, res, next) => {
  const { request } = req.body;

  try {
    tar.c({ sync: true, gzip: true, cwd: tmpDir }, [request]).pipe(res);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/qtls-locus-alignment-boxplots', (req, res, next) =>
  qtlsCalculateLocusAlignmentBoxplots(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    req,
    res,
    next
  )
);

apiRouter.post('/qtls-locus-colocalization-hyprcoloc-ld', (req, res, next) =>
  qtlsCalculateLocusColocalizationHyprcolocLD(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    req,
    res,
    next
  )
);

apiRouter.post('/qtls-locus-colocalization-hyprcoloc', (req, res, next) =>
  qtlsCalculateLocusColocalizationHyprcoloc(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    req,
    res,
    next
  )
);

apiRouter.post('/qtls-locus-colocalization-ecaviar', (req, res, next) => {
  qtlsCalculateLocusColocalizationECAVIAR(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    req,
    res,
    next
  );
});

apiRouter.post('/qtls-locus-qc', (req, res, next) =>
  qtlsCalculateQC(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    res,
    next
  )
);

apiRouter.post('/qtls-coloc-visualize', (req, res, next) =>
  qtlsColocVisualize(req.body, res, next)
);

apiRouter.post('/qtls-locus-ld', (req, res, next) =>
  qtlsCalculateLD({ ...req.body, workingDirectory: workingDirectory, bucket: awsInfo.s3.data }, res, next)
);


module.exports = { apiRouter };
