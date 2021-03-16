const express = require('express');
const compression = require('compression');
const config = require('../config');
const logger = require('./logger');
const path = require('path');
const { qtlsCalculateMain } = require('./calculate');
const apiRouter = express.Router();
const multer  = require('multer');
const fs = require('fs');

const dataDir = path.resolve(config.data.folder);
const tmpDir = path.resolve(config.tmp.folder);
const awsInfo = config.aws;
const workingDirectory = path.resolve(config.R.workDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("req", req);
        console.log("req.body", req.body);
        const { request_id } = req.body;
        const uploadDir = path.resolve(tmpDir, request_id);
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // console.log('file', file);
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
apiRouter.post('/file-upload', upload.single('dataFile'), async (req, res) => {
    // const dataFile = req.file.path;
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log(req.file, req.body)
    res.json({ msg: 'file uploaded' });
});

// calculation routes
apiRouter.post('/qtls-calculate-main', (req, res, next) => qtlsCalculateMain({...req.body, workingDirectory}, res, next));

module.exports = { apiRouter };
