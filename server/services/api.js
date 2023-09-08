import express from 'express';
import Router from 'express-promise-router';
import compression from 'compression';
import { logRequests, logErrors } from './middleware.js';
import calculationRoutes from './calculationRoutes.js';

export function createApi(env) {
  // register middleware
  const router = Router();
  router.use(express.json({ limit: '10mb' }));
  router.use(compression());
  router.use(logRequests());

  // serve static files under /data
  router.use('/data', express.static(env.DATA_FOLDER));

  // register routes
  router.get('/ping', async (req, res) => res.json(true));
  router.use(calculationRoutes(env));

  router.use(logErrors());
  return router;
}
