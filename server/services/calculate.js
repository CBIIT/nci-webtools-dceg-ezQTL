const r = require('r-wrapper').async;
const path = require('path');
const logger = require('../services/logger');

async function qtlsCalculateMain(params, res, next) {
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
    chromosome,
    range,
    bucket,
  } = params;

  logger.info(`[${request}] Execute /qtls-calculate-main`);
  logger.debug(
    `[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`
  );

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
    chromosome.toString(),
    range.toString(),
    bucket.toString(),
  ]);
  try {
    const wrapper = await r(
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
        chromosome.toString(),
        range.toString(),
        bucket.toString(),
      ]
    );
    logger.info(`[${request}] Finished /qtls-calculate-main`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(`[${request}] Error /qtls-calculate-main ${err}`);
    res.status(500).json(err);
  }
}

async function qtlsCalculateLocusAlignmentBoxplots(params, res, next) {
  const {
    request,
    select_qtls_samples,
    quantificationFile,
    genotypeFile,
    info,
    workingDirectory,
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
      ]
    );
    logger.info(`[${request}] Finished /qtls-locus-alignment-boxplots`);
    res.json(JSON.parse(wrapper));
  } catch (err) {
    logger.error(`[${request}] Error /qtls-locus-alignment-boxplots ${err}`);
    res.status(500).json(err);
  }
}

async function qtlsCalculateLocusColocalizationHyprcolocLD(params, res, next) {
  const {
    request,
    ldfile,
    select_ref,
    select_chr,
    select_pos,
    select_dist,
    workingDirectory,
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

async function qtlsCalculateLocusColocalizationHyprcoloc(params, res, next) {
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
    chromosome,
    range,
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
  logger.debug([
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
    chromosome.toString(),
    range.toString(),
  ]);
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
        chromosome.toString(),
        range.toString(),
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

async function qtlsCalculateLocusColocalizationECAVIAR(params, res, next) {
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

module.exports = {
  qtlsCalculateMain,
  qtlsCalculateLocusAlignmentBoxplots,
  qtlsCalculateLocusColocalizationHyprcolocLD,
  qtlsCalculateLocusColocalizationHyprcoloc,
  qtlsCalculateLocusColocalizationECAVIAR,
};
