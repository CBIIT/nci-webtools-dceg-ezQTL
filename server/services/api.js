const express = require('express');
const compression = require('compression');
const config = require('../config');
const logger = require('./logger');
const path = require('path');
const {
  qtlsCalculateMain,
  qtlsCalculateLocusAlignmentBoxplots,
  qtlsCalculateLocusColocalizationHyprcoloc,
  qtlsCalculateLocusColocalizationECAVIAR,
  qtlsCalculateQC,
  qtlsCalculateLD,
  qtlsColocVisualize,
  qtlsCalculateQuantification,
} = require('./calculate');
const apiRouter = express.Router();
const multer = require('multer');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');
const tar = require('tar');
const Papa = require('papaparse');
const { validate, v1: uuidv1 } = require('uuid');

const dataDir = path.resolve(config.data.folder);
const tmpDir = path.resolve(config.tmp.folder);
const awsInfo = config.aws;
const workingDirectory = path.resolve(config.R.workDir);

AWS.config.update(awsInfo);

function parseCSV(filepath) {
  const file = fs.createReadStream(filepath);
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete(results, file) {
        resolve(results.data);
      },
      error(err, file) {
        logger.info('Error parsing ' + filepath);
        logger.error(err);
        reject(err);
      },
    });
  });
}

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

// get list of public data options
apiRouter.post('/getPublicGTEx', async (req, res, next) => {
  try {
    const workbook = XLSX.readFile(
      path.resolve(config.data.folder, 'vQTL2_resource.xlsx')
    );
    const sheetNames = workbook.SheetNames;
    const data = sheetNames.reduce(
      (acc, sheet) => ({
        ...acc,
        [sheet]: XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
      }),
      {}
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/queue', async (req, res, next) => {
  const { request, multi } = req.body;
  const sqs = new AWS.SQS();
  const wd = path.join(tmpDir, '/', request);

  if (!fs.existsSync(wd)) {
    fs.mkdirSync(wd);
  }
  fs.writeFileSync(path.join(wd, 'params.json'), JSON.stringify(req.body));
  try {
    logger.debug(`Uploading: ${fs.readdirSync(wd)}`);
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
          ...req.body,
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

apiRouter.post('/fetch-results', async (req, res, next) => {
  try {
    const s3 = new AWS.S3();
    const { request } = req.body;

    logger.info(`Fetch Queue Result: ${request}`);

    // validate request id
    if (!validate(request.substring(0, 36))) next(new Error(`Invalid request`));

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

      // download files if they do not exist
      if (!fs.existsSync(filepath)) {
        logger.debug(`Downloading file: ${Key}`);

        const object = await s3
          .getObject({
            Bucket: config.aws.s3.queue,
            Key,
          })
          .promise();

        await fs.promises.writeFile(filepath, object.Body);
        // extract and delete archive
        if (path.extname(filename) == '.tgz') {
          logger.debug(`Extracting ${filename} to ${resultsFolder}`);
          fs.createReadStream(filepath).pipe(
            await tar.x({ strip: 1, C: resultsFolder }),
            (err) => {
              if (err) logger.error(err);
              else {
                logger.debug('Extraction done');
                fs.unlink(filepath, (err) => {
                  if (err) {
                    logger.error(`Failed to delete ${filename}`);
                  } else {
                    logger.debug(`Deleted ${filename}`);
                  }
                });
              }
            }
          );
        }
      }
    }

    let stateFilePath = path.resolve(resultsFolder, `state.json`);

    if (fs.existsSync(stateFilePath)) {
      let data = JSON.parse(String(await fs.promises.readFile(stateFilePath)));

      res.json(data);
    } else {
      next(new Error(`Params not found`));
    }
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/fetch-sample', async (req, res, next) => {
  logger.info(`Fetching Sample`);
  try {
    const request_id = uuidv1();
    const sampleArchive = path.resolve(config.data.folder, 'sample/sample.tgz');
    const resultsFolder = path.resolve(config.tmp.folder, request_id);

    // ensure output directory exists
    await fs.promises.mkdir(resultsFolder, { recursive: true });

    // copy sample to resultsFolder
    await fs.copy(path.resolve(config.data.folder, 'sample'), resultsFolder);

    // extract files
    await new Promise((resolve, reject) => {
      fs.createReadStream(sampleArchive)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .pipe(tar.x({ strip: 1, C: resultsFolder }));
    });

    let stateFilePath = path.resolve(resultsFolder, `state.json`);

    if (fs.existsSync(stateFilePath)) {
      let data = JSON.parse(String(await fs.promises.readFile(stateFilePath)));

      // rename files
      const oldRequest = data.state.request;
      const files = fs.readdirSync(resultsFolder);
      files.forEach((file) =>
        fs.renameSync(
          path.resolve(resultsFolder, file),
          path.resolve(resultsFolder, file.replace(oldRequest, request_id))
        )
      );

      // replace request id
      data.state.request = request_id;
      data.state.inputs.request[0] = request_id;

      res.json(data);
    } else {
      next(new Error(`Params not found`));
    }
  } catch (error) {
    next(error);
  }
});

// Publications page data
apiRouter.get('/getPublications', async (req, res, next) => {
  try {
    const csv = await parseCSV(
      path.resolve(dataDir, 'vQTL2_resource_simple.csv')
    );

    res.json(csv);
  } catch (error) {
    next(error);
  }
});

// download work session
apiRouter.post('/locus-download', (req, res, next) => {
  const { request } = req.body;
  if (!validate(request)) next(new Error(`Invalid request`));

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
  qtlsCalculateLD(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    res,
    next
  )
);

apiRouter.post('/qtls-recalculate-quantification', (req, res, next) =>
  qtlsCalculateQuantification(
    {
      ...req.body,
      workingDirectory: workingDirectory,
      bucket: awsInfo.s3.data,
    },
    res,
    next
  )
);

module.exports = { apiRouter };
