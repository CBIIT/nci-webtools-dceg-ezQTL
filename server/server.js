import express from 'express';
import { validateEnvironment } from './services/environment.js';
import { createLogger } from './services/logger.js';
import { createApi } from './services/api.js';
import { isMainModule } from './services/utils.js';

// if this module is the main module, start the app
if (isMainModule(import.meta)) {
  const env = process.env;
  validateEnvironment(env);
  main(env);
}

/**
 * Creates and starts an express app given a specified environment.
 * @param {object} env
 * @returns {http.Server} a node http server
 */
export function main(env) {
  const { APP_PORT, APP_NAME, SERVER_TIMEOUT } = env;
  const serverTimeout = (+SERVER_TIMEOUT || 900) * 100;
  const app = createApp(env);
  const server = app.listen(APP_PORT, () => {
    app.locals.logger.info(`${APP_NAME} started on port ${APP_PORT}`);
  });
  server.setTimeout(serverTimeout);
  return server;
}

function createApp(env) {
  const { APP_NAME, LOG_LEVEL } = env;
  const app = express();

  // if behind a proxy, use the first x-forwarded-for address as the client's ip address
  app.set('trust proxy', true);
  app.set('json spaces', 2);
  app.set('x-powered-by', false);

  // register services as app locals
  app.locals.logger = createLogger(APP_NAME, LOG_LEVEL);

  app.use('/api', createApi(env));

  return app;
}
