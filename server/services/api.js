const express = require('express');
const compression = require('compression');
const config = require('../config');
const logger = require('./logger');
const path = require('path');
const { qtlsCalculateMain } = require('./calculate');
const apiRouter = express.Router();

const dataDir = path.resolve(config.data.folder);
const awsInfo = config.aws;
const workingDirectory = path.resolve(config.R.workDir);

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

// calculation routes
apiRouter.post('/qtls-calculate-main', (req, res, next) => qtlsCalculateMain({...req.body, workingDirectory}, res, next));

module.exports = { apiRouter };
