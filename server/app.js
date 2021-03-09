const process = require('process');
const express = require('express');
const config = require('./config.json');
const logger = require('./services/logger');
const { apiRouter } = require('./services/api');
const { forkCluster } = require('./services/cluster');

// returns true if in master process
if (forkCluster())
    return;

logger.info(`[${process.pid}] Started worker process`);

const app = express();
app.use('/api', apiRouter);

// serve public folder during local development
if (process.env.NODE_ENV !== 'production')
    app.use(express.static(config.server.client));

// global error handler
app.use((error, request, response, next) => {
    const { name, message, stack } = error;
    logger.error({ message, stack });
    response.status(500).json(`${name}: ${message}`);
});

app.listen(config.server.port, () => {
    logger.info(`Application is running on port: ${config.server.port}`)
});