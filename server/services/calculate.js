const { v1: uuidv1 } = require('uuid');
const r = require('r-wrapper').async;
const path = require('path');

async function qtlsCalculateMain(params, res, next) {
    console.log("params", params);
    const {
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
    const rfile = path.resolve(__dirname, 'query_scripts', 'QTLs', 'qtls.r');
    const request = uuidv1();
    try {
        const wrapper = await r(
            path.resolve(__dirname, 'query_scripts', 'wrapper.R'),
            "qtlsCalculateMain",
            [
                rfile,
                workingDirectory,
                select_qtls_samples.toString(),
                select_gwas_sample.toString(),
                associationFile,
                quantificationFile,
                genotypeFile,
                gwasFile,
                LDFile,
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
        res.json(JSON.parse(wrapper));
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    // console.log("qtlsCalculateMain", [
    //                 rfile,
    //                 workingDirectory,
    //                 select_qtls_samples,
    //                 select_gwas_sample,
    //                 associationFile,
    //                 quantificationFile,
    //                 genotypeFile,
    //                 gwasFile,
    //                 LDFile,
    //                 request,
    //                 select_pop,
    //                 select_gene,
    //                 select_dist,
    //                 select_ref,
    //                 recalculateAttempt,
    //                 recalculatePop,
    //                 recalculateGene,
    //                 recalculateDist,
    //                 recalculateRef
    //             ]);
    // res.json({content: 'hi'});
}

module.exports = {
    qtlsCalculateMain
}