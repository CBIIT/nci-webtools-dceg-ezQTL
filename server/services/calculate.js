import rWrapper from 'r-wrapper';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { mkdirs, writeJson } from './utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = rWrapper.async;

async function calculateMain(params) {
  const {
    request,
    associationFile,
    quantificationFile,
    genotypeFile,
    gwasFile,
    LDFile,
    select_pop,
    select_gene,
    select_dist,
    select_ref,
    recalculateAttempt,
    recalculatePop,
    recalculateGene,
    recalculateDist,
    recalculateRef,
    ldProject,
    qtlKey,
    ldKey,
    gwasKey,
    select_chromosome,
    select_position,
    genome_build,
  } = params;

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateMain',
    [
      associationFile.toString(),
      quantificationFile.toString(),
      genotypeFile.toString(),
      gwasFile.toString(),
      LDFile.toString(),
      request.toString(),
      select_pop.toString(),
      select_gene.toString(),
      select_dist.toString(),
      select_ref.toString(),
      recalculateAttempt.toString(),
      recalculatePop.toString(),
      recalculateGene.toString(),
      recalculateDist.toString(),
      recalculateRef.toString(),
      ldProject,
      qtlKey.toString(),
      ldKey.toString(),
      gwasKey.toString(),
      select_chromosome.toString(),
      parseInt(select_position),
      genome_build.toString(),
    ]
  );
}

async function qtlsCalculateMain(params, logger, env) {
  const { request } = params;
  logger.info(`[${request}] Execute /qtls-calculate-main`);
  // logger.debug(
  //   `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  // );

  // try {
  const wrapper = await calculateMain(params);
  logger.info(`[${request}] Finished /qtls-calculate-main`);

  const logPath = path.resolve(env.OUTPUT_FOLDER, request, 'ezQTL.log');

  const summary = getSummary(logPath);

  return { ...JSON.parse(wrapper), summary };
  // } catch (err) {
  //   logger.error(`[${request}] Error /qtls-calculate-main ${err}`);
  //   res.status(500).json(err);
  // }
}
async function calculateQuantification(params) {
  const { request, exprFile, genoFile, traitID, genotypeID, log2 } = params;

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsRecalculateQuantification',
    [exprFile, genoFile, traitID, genotypeID, log2, request]
  );
}

async function qtlsCalculateQuantification(params, logger, env) {
  const { request } = params;

  logger.info(`[${request}] Execute /calculate-quantification`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const wrapper = await calculateQuantification(params);
  logger.info(`[${request}] Finished /calculate-quantification`);
  return JSON.parse(wrapper);
}

async function qtlsCalculateLocusAlignmentBoxplots(params, logger, env) {
  const { request, quantificationFile, genotypeFile, info } = params;

  logger.info(`[${request}] Execute /qtls-locus-alignment-boxplots`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const wrapper = await r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLocusAlignmentBoxplots',
    [
      quantificationFile.toString(),
      genotypeFile.toString(),
      JSON.stringify(info),
      request.toString(),
    ]
  );
  logger.info(`[${request}] Finished /qtls-locus-alignment-boxplots`);
  return JSON.parse(wrapper);
}

async function calculateHyprcoloc(params) {
  const { request, select_dist, select_ref, gwasfile, qtlfile, ldfile } =
    params;

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLocusColocalizationHyprcoloc',
    [
      select_dist.toString(),
      select_ref.toString(),
      gwasfile.toString(),
      qtlfile.toString(),
      ldfile.toString(),
      request.toString(),
    ]
  );
}

async function qtlsCalculateLocusColocalizationHyprcoloc(params, logger, env) {
  const { request } = params;

  logger.info(`[${request}] Execute /qtls-locus-colocalization-hyprcoloc`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  // try {
  const wrapper = await calculateHyprcoloc(params);
  logger.info(`[${request}] Finished /qtls-locus-colocalization-hyprcoloc`);
  return JSON.parse(wrapper);
  // } catch (error) {
  //   logger.error(
  //     `[${request}] Error /qtls-locus-colocalization-hyprcoloc ${error}`
  //   );

  //   const logPath = path.resolve(
  //     params.
  //     'tmp',
  //     request,
  //     'ezQTL.log'
  //   );
  //   const summary = getSummary(logPath);

  //   res.status(500).json({ error, summary });
  // }
}

function calculateECAVIAR(params) {
  const {
    request,
    gwasFile,
    associationFile,
    LDFile,
    select_ref,
    select_dist,
  } = params;

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLocusColocalizationECAVIAR',
    [
      gwasFile.toString(),
      associationFile.toString(),
      LDFile.toString(),
      select_ref.toString(),
      select_dist.toString(),
      request.toString(),
    ]
  );
}

async function qtlsCalculateLocusColocalizationECAVIAR(params, logger, env) {
  const { request } = params;

  logger.info(`[${request}] Execute /qtls-locus-colocalization-ecaviar`);

  const wrapper = await calculateECAVIAR(params);
  logger.info(`[${request}] Finished /qtls-locus-colocalization-ecaviar`);
  return JSON.parse(wrapper);
}

function calculateColocVisualize(params) {
  const { request, hydata, ecdata } = params;
  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsColocVisualize',
    [hydata, ecdata, request]
  );
}

async function qtlsColocVisualize(params, logger, env) {
  const { request } = params;
  logger.info(`[${request}] Execute /coloc-visualize`);
  const wrapper = await calculateColocVisualize(params);
  logger.info(`[${request}] Finished /colc-visualize`);
  return wrapper;
}

async function calculateQC(params, logger, env = process.env) {
  const {
    request,
    gwasFile,
    associationFile,
    LDFile,
    quantificationFile,
    genotypeFile,
    qtlKey,
    ldKey,
    gwasKey,
    select_ref,
    select_dist,
    select_chromosome,
    select_position,
    select_pop,
    ldProject,
    phenotype,
    qtlPublic,
    gwasPublic,
    ldPublic,
  } = params;

  const calculate = JSON.parse(
    await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsCalculateQC',
      [
        gwasFile.toString(),
        associationFile.toString(),
        LDFile.toString(),
        quantificationFile,
        genotypeFile,
        qtlKey.toString(),
        gwasKey.toString(),
        ldKey.toString(),
        select_ref.toString(),
        select_dist.toString(),
        select_chromosome,
        select_position,
        select_pop,
        ldProject,
        phenotype,
        request,
        qtlPublic.toString(),
        gwasPublic.toString(),
        ldPublic.toString(),
      ]
    )
  );

  if (calculate?.error) logger.error(calculate.error);
  return calculate;
}

// read log file
function getSummary(path) {
  return fs.existsSync(path)
    ? String(fs.readFileSync(path)).replace(/#/g, '\u2022').split('\n\n')
    : null;
}

async function qtlsCalculateQC(params, logger, env) {
  const { request } = params;
  logger.info(`[${request}] Execute /qtlsCalculateQC`);
  const inputFolder = path.resolve(env.INPUT_FOLDER, request);
  const outputFolder = path.resolve(env.OUTPUT_FOLDER, request);
  await mkdirs([inputFolder, outputFolder]);
  await writeJson(path.resolve(outputFolder, 'params.json'), params);
  const { error, ...rest } = await calculateQC(params, logger);
  const logPath = path.resolve(outputFolder, 'ezQTL.log');
  const summary = getSummary(logPath);

  logger.info(`[${request}] Finished /qtlsCalculateQC`);
  return { summary: summary, error: error || false, ...rest };
}

async function calculateLocusLD(params) {
  const {
    request,
    associationFile,
    gwasFile,
    LDFile,
    genome_build,
    leadsnp,
    position,
    ldThreshold,
    ldAssocData,
    select_gene,
  } = params;

  let threshold = ldThreshold;
  if (ldThreshold) threshold = parseFloat(ldThreshold);

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLD',
    [
      gwasFile.toString(),
      associationFile.toString(),
      LDFile.toString(),
      genome_build.toString(),
      leadsnp.toString(),
      position,
      threshold,
      ldAssocData,
      select_gene,
      request.toString(),
    ]
  );
}

async function qtlsCalculateLD(params, logger, env) {
  const { request } = params;

  logger.info(`[${request}] Execute /calculateLD`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const wrapper = await calculateLocusLD(params, logger, env);
  logger.info(`[${request}] Finished /calculateLD`);
  return wrapper;
}

export {
  calculateMain,
  qtlsCalculateMain,
  qtlsCalculateLocusAlignmentBoxplots,
  calculateHyprcoloc,
  qtlsCalculateLocusColocalizationHyprcoloc,
  calculateECAVIAR,
  qtlsCalculateLocusColocalizationECAVIAR,
  calculateQC,
  qtlsCalculateQC,
  calculateLocusLD,
  qtlsCalculateLD,
  calculateColocVisualize,
  qtlsColocVisualize,
  qtlsCalculateQuantification,
};
