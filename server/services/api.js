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
    qtlsCalculateQC
} = require('./calculate');
const apiRouter = express.Router();
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');

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

// parse json requests
apiRouter.use(express.json());

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
    const filestream = new AWS.S3()
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

apiRouter.post('/qtls-locus-alignment-boxplots', (req, res, next) => qtlsCalculateLocusAlignmentBoxplots({...req.body, workingDirectory}, req, res, next))

apiRouter.post('/qtls-locus-colocalization-hyprcoloc-ld', (req, res, next) => qtlsCalculateLocusColocalizationHyprcolocLD({...req.body, workingDirectory}, req, res, next))

apiRouter.post('/qtls-locus-colocalization-hyprcoloc', (req, res, next) => qtlsCalculateLocusColocalizationHyprcoloc({...req.body, workingDirectory}, req, res, next))

apiRouter.post('/qtls-locus-colocalization-ecaviar', (req, res, next) => {
  req.setTimeout(900000);
  qtlsCalculateLocusColocalizationECAVIAR({...req.body, workingDirectory}, req, res, next);
})

apiRouter.post('/qtls-locus-qc', (req, res, next) => qtlsCalculateQC({...req.body, workingDirectory}, res, next))

module.exports = { apiRouter };
