import Router from 'express-promise-router';
import { check } from 'express-validator';
import path from 'path';
import multer from 'multer';
import fs from 'fs-extra';
import XLSX from 'xlsx';
import tar from 'tar';
import { validate, v1 as uuidv1 } from 'uuid';
import { handleValidationErrors, logFiles } from './middleware.js';
import { parseCSV, mkdirs, writeJson, getFiles } from './utils.js';
import {
  qtlsCalculateMain,
  qtlsCalculateLocusAlignmentBoxplots,
  qtlsCalculateLocusColocalizationHyprcoloc,
  qtlsCalculateLocusColocalizationECAVIAR,
  qtlsCalculateQC,
  qtlsCalculateLD,
  qtlsColocVisualize,
  qtlsCalculateQuantification,
} from './calculate.js';
import { getWorker } from './workers.js';

export default function calculationRoutes(env) {
  const router = Router();
  const dataDir = path.resolve(env.APP_DATA_FOLDER);
  const inputFolder = path.resolve(env.INPUT_FOLDER);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { request } = req.body;
      const uploadDir = path.resolve(inputFolder, request);
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
  const validateRequest = check('request').isUUID();

  // file upload route
  router.post(
    '/file-upload/:request',
    validateRequest,
    handleValidationErrors,
    upload.any(),
    logFiles(),
    async (req, res) => res.json(true)
  );

  // calculation routes
  router.post('/qtls-calculate-main', async (req, res) => {
    req.setTimeout(900000);
    res.setTimeout(900000, () => {
      res.status(504).send('Calculation Timed Out');
    });

    res.json(await qtlsCalculateMain(req.body, req.app.locals.logger, env));
  });

  // get list of public data options
  router.post('/getPublicGTEx', async (req, res) => {
    const workbook = XLSX.readFile(
      path.resolve(env.APP_DATA_FOLDER, 'vQTL2_resource.xlsx')
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
  });

  router.post(
    '/submitLong',
    validateRequest,
    handleValidationErrors,
    async (req, res) => {
      const { request } = req.body;
      const inputFolder = path.resolve(env.INPUT_FOLDER, request);
      const outputFolder = path.resolve(env.OUTPUT_FOLDER, request);
      const paramsFilePath = path.resolve(inputFolder, 'params.json');
      const statusFilePath = path.resolve(outputFolder, 'status.json');
      await mkdirs([inputFolder, outputFolder]);

      const status = {
        id: request,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      };

      await writeJson(paramsFilePath, req.body);
      await writeJson(statusFilePath, status);

      const type = env.NODE_ENV === 'dev' ? 'local' : 'fargate';
      const worker = getWorker(type);
      worker(request, req.app, env);
      res.json(request);
    }
  );

  router.post(
    '/fetch-results',
    validateRequest,
    handleValidationErrors,
    async (req, res) => {
      const { logger } = req.app.locals;

      try {
        const { request } = req.body;

        logger.info(`Fetch Queue Result: ${request}`);

        // ensure output directory exists
        const outputFolder = path.resolve(env.OUTPUT_FOLDER, request);
        await mkdirs([outputFolder]);

        let stateFilePath = path.resolve(outputFolder, `state.json`);

        if (fs.existsSync(stateFilePath)) {
          let data = JSON.parse(
            String(await fs.promises.readFile(stateFilePath))
          );

          res.json(data);
        } else {
          next(new Error(`Params not found`));
        }
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/fetch-sample', async (req, res, next) => {
    const { logger } = req.app.locals;

    logger.info(`Fetching Sample`);
    try {
      const request = uuidv1();
      const sampleArchive = path.resolve(
        env.APP_DATA_FOLDER,
        'sample/sample.tgz'
      );
      const resultsFolder = path.resolve(env.OUTPUT_FOLDER, request);

      // ensure output directory exists
      await fs.promises.mkdir(resultsFolder, { recursive: true });

      // copy sample to resultsFolder
      await fs.copy(path.resolve(env.APP_DATA_FOLDER, 'sample'), resultsFolder);

      // extract files
      await new Promise((resolve, reject) => {
        fs.createReadStream(sampleArchive)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .pipe(tar.x({ strip: 1, C: resultsFolder }));
      });

      let stateFilePath = path.resolve(resultsFolder, `state.json`);

      if (fs.existsSync(stateFilePath)) {
        let data = JSON.parse(
          String(await fs.promises.readFile(stateFilePath))
        );

        // rename files
        const oldRequest = data.state.request;
        const files = fs.readdirSync(resultsFolder);
        files.forEach((file) =>
          fs.renameSync(
            path.resolve(resultsFolder, file),
            path.resolve(resultsFolder, file.replace(oldRequest, request))
          )
        );

        // replace request id
        data.state.request = request;
        data.state.inputs.request[0] = request;

        res.json(data);
      } else {
        next(new Error(`Params not found`));
      }
    } catch (error) {
      next(error);
    }
  });

  // Publications page data
  router.get('/getPublications', async (req, res, next) => {
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
  router.get(
    '/locus-download/:request',
    validateRequest,
    handleValidationErrors,
    (req, res, next) => {
      const { request } = req.params;
      res.attachment(`${request}.tar.gz`);
      tar.c({ gzip: true, cwd: env.OUTPUT_FOLDER }, [request]).pipe(res);
    }
  );

  router.post('/qtls-locus-alignment-boxplots', (req, res, next) =>
    qtlsCalculateLocusAlignmentBoxplots(req.body, req, res, next)
  );

  router.post('/qtls-locus-colocalization-hyprcoloc', async (req, res) =>
    res.json(
      await qtlsCalculateLocusColocalizationHyprcoloc(
        req.body,
        req.app.locals.logger,
        env
      )
    )
  );

  router.post('/qtls-locus-colocalization-ecaviar', async (req, res) => {
    req.setTimeout(900000);
    res.setTimeout(900000, () => {
      res.status(504).send('Calculation Timed Out');
    });
    res.json(
      await qtlsCalculateLocusColocalizationECAVIAR(
        req.body,
        req.app.locals.logger,
        env
      )
    );
  });

  router.post('/qtls-locus-qc', async (req, res) =>
    res.json(await qtlsCalculateQC(req.body, req.app.locals.logger, env))
  );

  router.post('/qtls-coloc-visualize', async (req, res) =>
    res.json(await qtlsColocVisualize(req.body, req.app.locals.logger, env))
  );

  router.post('/qtls-locus-ld', async (req, res) =>
    res.json(await qtlsCalculateLD(req.body, req.app.locals.logger, env))
  );

  router.post('/qtls-recalculate-quantification', async (req, res) =>
    res.json(
      await qtlsCalculateQuantification(req.body, req.app.locals.logger, env)
    )
  );
  return router;
}