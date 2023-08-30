import process from 'process';
import express from 'express';
import config from './config.json' assert { type: 'json' };
import logger from './services/logger.js';
import { apiRouter } from './services/api.js';

logger.info(`[${process.pid}] Started worker process`);

const app = express();
app.use('/api', apiRouter);

// serve public folder during local development
// if (process.env.NODE_ENV !== 'production')
app.use(express.static(config.server.client));

// global error handler
app.use((error, request, response, next) => {
  const { name, message, stack } = error;
  logger.error({ message, stack });
  response.status(500).json(`${name}: ${message}`);
});

app.listen(config.server.port, () => {
  logger.info(`Application is running on port: ${config.server.port}`);
});
