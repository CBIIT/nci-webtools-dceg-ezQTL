const r = require('r-wrapper').async;
const path = require('path');
const logger = require('../services/logger');
const config = require('../config');
const AWS = require('aws-sdk');
const fs = require('fs');

const awsInfo = config.aws;
AWS.config.update(awsInfo);

async function calculateMain(params) {
  const {
    request,
    select_qtls_samples,
    select_gwas_sample,
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
    workingDirectory,
    ldProject,
    qtlKey,
    ldKey,
    gwasKey,
    select_chromosome,
    select_position,
    bucket,
  } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'qtls.r');

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateMain',
    [
      rfile,
      workingDirectory.toString(),
      select_qtls_samples.toString(),
      select_gwas_sample.toString(),
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
      ldProject.toString(),
      qtlKey.toString(),
      ldKey.toString(),
      gwasKey.toString(),
      select_chromosome.toString(),
      parseInt(select_position),
      bucket.toString(),
    ]
  );
}

async function qtlsCalculateMain(params, req, res, next) {
  req.setTimeout(900000);
  const { request } = params;
  logger.info(`[${request}] Execute /qtls-calculate-main`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  try {
    const wrapper = await calculateMain(params);
    logger.info(`[${request}] Finished /qtls-calculate-main`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(`[${request}] Error /qtls-calculate-main ${err}`);
    res.status(500).json(err);
  }
}
async function calculateQuantification(params) {
  const {
    request,
    select_qtls_samples,
    exprFile,
    genoFile,
    traitID,
    genotypeID,
    log2,
    bucket,
    workingDirectory,
  } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsRecalculateQuantification',
    [
      rfile,
      workingDirectory,
      select_qtls_samples,
      exprFile,
      genoFile,
      traitID,
      genotypeID,
      log2,
      request,
      bucket,
    ]
  );
}

async function qtlsCalculateQuantification(params, res, next) {
  const { request } = params;

  logger.info(`[${request}] Execute /calculate-quantification`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  try {
    const wrapper = await calculateQuantification(params);
    logger.info(`[${request}] Finished /calculate-quantification`);
    res.json(wrapper);
  } catch (err) {
    logger.error(`[${request}] Error /calculate-quantification ${err}`);
    res.status(500).json(err);
  }
}

async function qtlsCalculateLocusAlignmentBoxplots(params, req, res, next) {
  const {
    request,
    select_qtls_samples,
    quantificationFile,
    genotypeFile,
    info,
    workingDirectory,
    bucket,
  } = params;

  logger.info(`[${request}] Execute /qtls-locus-alignment-boxplots`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'qtls.r');
  try {
    const wrapper = await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsCalculateLocusAlignmentBoxplots',
      [
        rfile,
        workingDirectory.toString(),
        select_qtls_samples.toString(),
        quantificationFile.toString(),
        genotypeFile.toString(),
        JSON.stringify(info),
        request.toString(),
        bucket.toString(),
      ]
    );
    logger.info(`[${request}] Finished /qtls-locus-alignment-boxplots`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(`[${request}] Error /qtls-locus-alignment-boxplots ${err}`);
    res.status(500).json(err);
  }
}

async function calculateHyprcoloc(params) {
  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    select_dist,
    select_ref,
    gwasfile,
    qtlfile,
    ldfile,
    workingDirectory,
    qtlKey,
    select_chromosome,
    select_position,
    bucket,
  } = params;

  const rfile = path.resolve(
    __dirname,
    'query_scripts',
    'QTLs',
    'qtls-locus-colocalization-hyprcoloc.r'
  );

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLocusColocalizationHyprcoloc',
    [
      rfile,
      workingDirectory.toString(),
      select_gwas_sample.toString(),
      select_qtls_samples.toString(),
      select_dist.toString(),
      select_ref.toString(),
      gwasfile.toString(),
      qtlfile.toString(),
      ldfile.toString(),
      request.toString(),
      qtlKey.toString(),
      select_chromosome.toString(),
      parseInt(select_position),
      bucket.toString(),
    ]
  );
}

async function qtlsCalculateLocusColocalizationHyprcoloc(
  params,
  req,
  res,
  next
) {
  const { request } = params;

  logger.info(`[${request}] Execute /qtls-locus-colocalization-hyprcoloc`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  try {
    const wrapper = await calculateHyprcoloc(params);
    logger.info(`[${request}] Finished /qtls-locus-colocalization-hyprcoloc`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(
      `[${request}] Error /qtls-locus-colocalization-hyprcoloc ${err}`
    );
    res.status(500).json(err);
  }
}

function calculateECAVIAR(params) {
  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    gwasFile,
    associationFile,
    LDFile,
    select_ref,
    select_dist,
    workingDirectory,
    bucket,
  } = params;

  const rfile = path.resolve(
    __dirname,
    'query_scripts',
    'QTLs',
    'qtls-locus-colocalization-ecaviar.r'
  );
  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLocusColocalizationECAVIAR',
    [
      rfile,
      workingDirectory.toString(),
      select_gwas_sample.toString(),
      select_qtls_samples.toString(),
      gwasFile.toString(),
      associationFile.toString(),
      LDFile.toString(),
      select_ref.toString(),
      select_dist.toString(),
      request.toString(),
      bucket.toString(),
    ]
  );
}

async function qtlsCalculateLocusColocalizationECAVIAR(params, req, res, next) {
  req.setTimeout(900000);
  const { request } = params;

  logger.info(`[${request}] Execute /qtls-locus-colocalization-ecaviar`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  try {
    const wrapper = await calculateECAVIAR(params);
    logger.info(`[${request}] Finished /qtls-locus-colocalization-ecaviar`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(
      `[${request}] Error /qtls-locus-colocalization-ecaviar ${err}`
    );
    res.status(500).json(err);
  }
}

function calculateColocVisualize(params) {
  const { request, hydata, ecdata } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');
  const requestPath = path.resolve(
    config.tmp.folder,
    request,
    request + '_Summary.svg'
  );

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsColocVisualize',
    [rfile, hydata, ecdata, requestPath]
  );
}

async function qtlsColocVisualize(params, res, next) {
  const { request } = params;

  logger.info(`[${request}] Execute /coloc-visualize`);

  try {
    const wrapper = await calculateColocVisualize(params);
    logger.info(`[${request}] Finished /colc-visualize`);
    res.json(wrapper);
  } catch (err) {
    logger.error(`[${request}] Error /colc-visualize ${err}`);
    res.status(500).json(err);
  }
}

async function calculateQC(params) {
  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    gwasFile,
    associationFile,
    LDFile,
    qtlKey,
    ldKey,
    gwasKey,
    select_ref,
    select_dist,
    select_chromosome,
    select_position,
    select_pop,
    ldProject,
    gwasPhenotype,
    workingDirectory,
    qtlPublic,
    gwasPublic,
    ldPublic,
    bucket,
  } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');

  const plotPath = path.resolve(workingDirectory, 'tmp', request, request);
  const inputPath = path.resolve(
    workingDirectory,
    'tmp',
    request,
    'ezQTL_input'
  );
  const logPath = path.resolve(workingDirectory, 'tmp', request, 'ezQTL.log');

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateQC',
    [
      rfile,
      select_gwas_sample.toString(),
      select_qtls_samples.toString(),
      gwasFile.toString(),
      associationFile.toString(),
      LDFile.toString(),
      qtlKey.toString(),
      gwasKey.toString(),
      ldKey.toString(),
      select_ref.toString(),
      select_dist.toString(),
      select_chromosome,
      select_position,
      select_pop,
      ldProject.toString(),
      gwasPhenotype,
      request,
      plotPath,
      inputPath,
      logPath,
      qtlPublic.toString(),
      gwasPublic.toString(),
      ldPublic.toString(),
      workingDirectory,
      bucket,
    ]
  );
}

async function qtlsCalculateQC(params, res, next) {
  const { request, workingDirectory } = params;

  logger.info(`[${request}] Execute /ezQTL_ztw`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const logPath = path.resolve(workingDirectory, 'tmp', request, 'ezQTL.log');

  try {
    const wrapper = await calculateQC(params);

    let summary = '';
    if (fs.existsSync(logPath)) {
      summary = String(await fs.promises.readFile(logPath));
    }

    summary = summary.replace(/#/g, '\u2022');
    summary = summary.split('\n\n');

    logger.info(`[${request}] Finished /ezqTL_ztw`);
    res.json(summary);
  } catch (err) {
    logger.error(`[${request}] Error /ezqTL_ztw ${err}`);
    res.status(500).json(err);
  }
}

async function calculateLocusLD(params) {
  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    associationFile,
    gwasFile,
    LDFile,
    genome_build,
    leadsnp,
    position,
    ldThreshold,
    ldAssocData,
    select_gene,
    workingDirectory,
    bucket,
  } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');
  const outputPath = path.resolve(
    workingDirectory,
    'tmp',
    request,
    'LD_Output.png'
  );

  let threshold = ldThreshold;

  if (ldThreshold) threshold = parseFloat(ldThreshold);

  return r(
    path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
    'qtlsCalculateLD',
    [
      rfile,
      select_gwas_sample.toString(),
      select_qtls_samples.toString(),
      gwasFile.toString(),
      associationFile.toString(),
      LDFile.toString(),
      genome_build.toString(),
      outputPath.toString(),
      leadsnp.toString(),
      position,
      threshold,
      ldAssocData,
      select_gene,
      request.toString(),
      workingDirectory,
      bucket,
    ]
  );
}

async function qtlsCalculateLD(params, res, next) {
  const { request } = params;

  logger.info(`[${request}] Execute /calculateLD`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  try {
    const wrapper = await calculateLocusLD(params);
    logger.info(`[${request}] Finished /calculateLD`);
    res.json(wrapper);
  } catch (err) {
    logger.error(`[${request}] Error /calculateLD ${err}`);
    res.status(500).json(err);
  }
}

module.exports = {
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
