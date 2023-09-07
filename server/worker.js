import path from 'path';
import { isMainModule, readJson } from './services/utils.js';
import { createLogger } from './services/logger.js';
import { mkdirs } from './services/utils.js';
import { runCalculation } from './services/calculationWorker.js';

if (isMainModule(import.meta)) {
  try {
    await main(process.argv, process.env);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export async function main(argv = process.argv, env = process.env) {
  const id = argv[2];
  if (!id) throw new Error('Missing id');

  const inputFolder = path.resolve(env.INPUT_FOLDER, id);
  const outputFolder = path.resolve(env.OUTPUT_FOLDER, id);
  await mkdirs([inputFolder, outputFolder]);

  const paramsFilePath = path.resolve(inputFolder, 'params.json');
  const params = await readJson(paramsFilePath);
  const logger = createLogger(env.APP_NAME, env.LOG_LEVEL);
  logger.info({ params });
  return await runCalculation(params, logger, env);
}
