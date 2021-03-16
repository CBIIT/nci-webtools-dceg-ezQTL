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
        workingDirectory
    } = params;

    logger.info(`[${request}] Execute /qtls-calculate-main`);
    logger.debug(`[${request}] Parameters ${JSON.stringify(params, undefined, 4)}`);

    const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'qtls.r');
    try {
        const wrapper = await r(
            path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
            "qtlsCalculateMain",
            [
                rfile,
                workingDirectory,
                select_qtls_samples.toString(),
                select_gwas_sample.toString(),
                associationFile.toString(),
                quantificationFile.toString(),
                genotypeFile.toString(),
                gwasFile.toString(),
                LDFile.toString(),
                request,
                select_pop.toString(),
                select_gene,
                select_dist,
                select_ref.toString(),
                recalculateAttempt,
                recalculatePop,
                recalculateGene,
                recalculateDist,
                recalculateRef
            ]
        );
        logger.info(`[${request}] Finished /qtls-calculate-main`);
        res.json(JSON.parse(wrapper));
    } catch (err) {
        logger.error(`[${request}] Error /qtls-calculate-main ${err}`);
        res.status(500).json(err);
    }
}

module.exports = {
    qtlsCalculateMain
}