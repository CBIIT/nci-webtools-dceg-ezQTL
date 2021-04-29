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
    qtlKey,
    ldKey,
    gwasKey,
    select_chromosome,
    select_position,
    bucket,
  } = params;

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'qtls.r');
  logger.debug([
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
    qtlKey.toString(),
    ldKey.toString(),
    gwasKey.toString(),
    select_chromosome.toString(),
    select_position,
    bucket.toString(),
  ]);

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

async function qtlsCalculateLocusColocalizationHyprcolocLD(
  params,
  req,
  res,
  next
) {
  const {
    request,
    ldfile,
    select_ref,
    select_chr,
    select_pos,
    select_dist,
    workingDirectory,
    bucket
  } = params;

  logger.info(`[${request}] Execute /qtls-locus-colocalization-hyprcoloc-ld`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(
    __dirname,
    'query_scripts',
    'QTLs',
    'qtls-locus-colocalization-hyprcoloc-ld.r'
  );
  try {
    const wrapper = await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsCalculateLocusColocalizationHyprcolocLD',
      [
        rfile,
        workingDirectory.toString(),
        ldfile.toString(),
        select_ref.toString(),
        select_chr.toString(),
        select_pos.toString(),
        select_dist.toString(),
        request.toString(),
        bucket.toString(),
      ]
    );
    logger.info(
      `[${request}] Finished /qtls-locus-colocalization-hyprcoloc-ld`
    );
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(
      `[${request}] Error /qtls-locus-colocalization-hyprcoloc-ld ${err}`
    );
    res.status(500).json(err);
  }
}

async function qtlsCalculateLocusColocalizationHyprcoloc(
  params,
  req,
  res,
  next
) {
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

  logger.info(`[${request}] Execute /qtls-locus-colocalization-hyprcoloc`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(
    __dirname,
    'query_scripts',
    'QTLs',
    'qtls-locus-colocalization-hyprcoloc.r'
  );

  try {
    const wrapper = await r(
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
    logger.info(`[${request}] Finished /qtls-locus-colocalization-hyprcoloc`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(
      `[${request}] Error /qtls-locus-colocalization-hyprcoloc ${err}`
    );
    res.status(500).json(err);
  }
}

async function qtlsCalculateLocusColocalizationECAVIAR(params, req, res, next) {
  req.setTimeout(900000);
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

  logger.info(`[${request}] Execute /qtls-locus-colocalization-ecaviar`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(
    __dirname,
    'query_scripts',
    'QTLs',
    'qtls-locus-colocalization-ecaviar.r'
  );
  try {
    const wrapper = await r(
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
    logger.info(`[${request}] Finished /qtls-locus-colocalization-ecaviar`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(
      `[${request}] Error /qtls-locus-colocalization-ecaviar ${err}`
    );
    res.status(500).json(err);
  }
}

async function qtlsColocVisualize(params, res, next) {

  const {
    request,
    hydata,
    ecdata
  } = params;

  logger.info(`[${request}] Execute /coloc-visualize`);

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');
  const requestPath = path.resolve(config.tmp.folder, request, request + '_Summary.svg');

  try {
    const wrapper = await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsColocVisualize',
      [
        rfile,
        hydata,
        ecdata,
        requestPath
      ]
    );
    logger.info(`[${request}] Finished /colc-visualize`);
    res.json(wrapper);
  } catch (err) {
    logger.error(`[${request}] Error /colc-visualize ${err}`);
    res.status(500).json(err);
  }
}

async function qtlsCalculateQC(params, res, next) {
  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    gwasFile,
    associationFile,
    ldfile,
    leadsnp,
    select_dist,
    select_gene,
    workingDirectory,
    bucket,
  } = params;


  logger.info(`[${request}] Execute /ezQTL_ztw`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');

  const plotPath = path.resolve(workingDirectory, 'tmp', request, request)
  const inputPath = path.resolve(workingDirectory, 'tmp', request, 'ezQTL_input')
  const logPath = path.resolve(workingDirectory, 'tmp', request, 'ezQTL.log')
  try {
    const wrapper = await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsCalculateQC',
      [
        rfile,
        select_gwas_sample.toString(),
        select_qtls_samples.toString(),
        gwasFile.toString(),
        associationFile.toString(),
        ldfile.toString(),
        leadsnp.toString(),
        select_dist,
        select_gene.toString(),
        request,
        plotPath,
        inputPath,
        logPath,
        workingDirectory,
        bucket
      ]
    );

    let summary = '';
    if (fs.existsSync(logPath)) {
      summary = String(await fs.promises.readFile(logPath));
    }

    summary = summary.replace(/#/g,'\u2022')
    summary = summary.split('\n\n')

    logger.info(`[${request}] Finished /ezqTL_ztw`);
    res.json(summary);
  } catch (err) {
    logger.error(`[${request}] Error /ezqTL_ztw ${err}`);
    res.status(500).json(err);
  }
}

async function qtlsCalculateLD(params, res, next) {

  const {
    request,
    select_gwas_sample,
    select_qtls_samples,
    associationFile,
    gwasFile,
    LDFile,
    leadsnp,
    workingDirectory,
    bucket
  } = params;

  logger.info(`[${request}] Execute /calculateLD`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

  const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'ezQTL_ztw.R');
  const tabixPath = path.resolve(workingDirectory, 'data','tabix')
  const outputPath = path.resolve(workingDirectory, 'tmp', request, 'LD_Output.svg')

  logger.info(tabixPath)
  logger.info(outputPath)

  try {

    const wrapper = await r(
      path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
      'qtlsCalculateLD',
      [
        rfile,
        select_gwas_sample.toString(),
        select_qtls_samples.toString(),
        gwasFile.toString(),
        associationFile.toString(),
        LDFile.toString(),
        tabixPath.toString(),
        outputPath.toString(),
        leadsnp.toString(),
        request.toString(),
        workingDirectory,
        bucket
      ]
    );
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
  qtlsCalculateLocusColocalizationHyprcolocLD,
  qtlsCalculateLocusColocalizationHyprcoloc,
  qtlsCalculateLocusColocalizationECAVIAR,
  qtlsCalculateQC,
  qtlsCalculateLD,
  qtlsColocVisualize
};
