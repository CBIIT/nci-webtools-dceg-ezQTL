const express = require('express');
const compression = require('compression');
const config = require('../config');
const logger = require('./logger');
const path = require('path');
const { 
    qtlsCalculateMain,
    qtlsCalculateLocusAlignmentBoxplots
} = require('./calculate');
const apiRouter = express.Router();
const multer  = require('multer');
const fs = require('fs');

const dataDir = path.resolve(config.data.folder);
const tmpDir = path.resolve(config.tmp.folder);
const awsInfo = config.aws;
const workingDirectory = path.resolve(config.R.workDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { request_id } = req.body;
        const uploadDir = path.resolve(tmpDir, request_id);
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
});
  
const upload = multer({ storage: storage })

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
    logger.debug(`[${req.body.request_id}] Parameters ${JSON.stringify(req.body, undefined, 4)}`);
    try {
        logger.info(`[${req.body.request_id}] Finished /file-upload`);
        res.json({
            files:req.files, 
            body: req.body
        });
    } catch (err) {
        logger.error(`[${req.body.request_id}] Error /file-upload ${err}`);
        res.status(500).json(err);
    }
});

// calculation routes
apiRouter.post('/qtls-calculate-main', (req, res, next) => qtlsCalculateMain({...req.body, workingDirectory}, res, next));

apiRouter.post('/qtls-locus-alignment-boxplots', (req, res, next) => qtlsCalculateLocusAlignmentBoxplots({...req.body, workingDirectory}, res, next))

module.exports = { apiRouter };
