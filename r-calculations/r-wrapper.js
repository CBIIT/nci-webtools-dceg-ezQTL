const { readFileSync, writeFileSync } = require('fs');
const { exec } = require('child_process');
const { fileSync } = require('tmp');

var logger = require('../logger');


function qtlsCalculateMain(rfile, select_qtls_samples, select_gwas_sample, associationFile, expressionFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef) {
    // console.log("Execute main qtls calculation.");
    logger.info("Execute main qtls calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        // console.log("R Working directory:", workingDirectory);
        logger.info("R Working directory:", workingDirectory);

        associationFile = JSON.stringify(associationFile);
        expressionFile = JSON.stringify(expressionFile);
        genotypeFile = JSON.stringify(genotypeFile);
        gwasFile = JSON.stringify(gwasFile);
        LDFile = JSON.stringify(LDFile);
        request = JSON.stringify(request);
        select_pop = JSON.stringify(select_pop);
        select_gene = JSON.stringify(select_gene);
        select_dist = JSON.stringify(select_dist);
        select_ref = JSON.stringify(select_ref);
        recalculateAttempt = JSON.stringify(recalculateAttempt);
        recalculatePop = JSON.stringify(recalculatePop);
        recalculateGene = JSON.stringify(recalculateGene);
        recalculateDist = JSON.stringify(recalculateDist);
        recalculateRef = JSON.stringify(recalculateRef);
        select_qtls_samples = JSON.stringify(select_qtls_samples);
        select_gwas_sample = JSON.stringify(select_gwas_sample);


        // console.log("Association File:", associationFile);
        // console.log("Expression File:", expressionFile);
        // console.log("Genotype File:", genotypeFile);
        // console.log("GWAS File:", gwasFile);
        // console.log("LD File:", LDFile);
        // console.log("Selected QTLs Sample Files:", select_qtls_samples);
        // console.log("Selected GWAS Sample File:", select_gwas_sample);
        // console.log("Request:", request);
        // console.log("Selected Pop:", select_pop);
        // console.log("Selected Gene:", select_gene);
        // console.log("Selected Dist:", select_dist);
        // console.log("Selected Ref:", select_ref);
        // console.log("Recalculate Attempt?", recalculateAttempt);
        // console.log("Recalculate Pop?", recalculatePop);
        // console.log("Recalculate Gene?", recalculateGene);
        // console.log("Recalculate Dist?", recalculateDist);
        // console.log("Recalculate Ref?", recalculateRef);
        
        logger.info("Association File:", associationFile);
        logger.info("Expression File:", expressionFile);
        logger.info("Genotype File:", genotypeFile);
        logger.info("GWAS File:", gwasFile);
        logger.info("LD File:", LDFile);
        logger.info("Selected QTLs Sample Files:", select_qtls_samples);
        logger.info("Selected GWAS Sample File:", select_gwas_sample);
        logger.info("Request:", request);
        logger.info("Selected Pop:", select_pop);
        logger.info("Selected Gene:", select_gene);
        logger.info("Selected Dist:", select_dist);
        logger.info("Selected Ref:", select_ref);
        logger.info("Recalculate Attempt?", recalculateAttempt);
        logger.info("Recalculate Pop?", recalculatePop);
        logger.info("Recalculate Gene?", recalculateGene);
        logger.info("Recalculate Dist?", recalculateDist);
        logger.info("Recalculate Ref?", recalculateRef);

        var code = readFileSync(rfile).toString();
        code += `main(${workingDirectory}, ${select_qtls_samples}, ${select_gwas_sample}, ${associationFile}, ${expressionFile}, ${genotypeFile}, ${gwasFile}, ${LDFile}, ${request}, ${select_pop}, ${select_gene}, ${select_dist}, ${select_ref}, ${recalculateAttempt}, ${recalculatePop}, ${recalculateGene}, ${recalculateDist}, ${recalculateRef})`;

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 }, // increase default maxBuffer from ~4kb to 100mb
            (error, stdout, stderr) => {
                try {
                    if (stdout) {
                        // resolve(JSON.parse(stdout.toString()));
                        var parsed = JSON.parse(JSON.parse(stdout));
                        // console.log(parsed);
                        logger.info("Resolve parsed obj keys:", Object.keys(parsed));
                        resolve(parsed);
                    } else {
                        if (error) reject(error);
                        if (stderr) reject(stderr);
                    }
                } catch(error) {
                    reject(error.toString());
                }
            }
        );
    });
}

function qtlsCalculateLocusAlignmentBoxplots(rfile, select_qtls_samples, expressionFile, genotypeFile, info) {
    // console.log("Execute qtls locus alignment boxplots calculation.");
    logger.info("Execute qtls locus alignment boxplots calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        // console.log("R Working directory:", workingDirectory);
        logger.info("R Working directory:", workingDirectory);

        expressionFile = JSON.stringify(expressionFile);
        genotypeFile = JSON.stringify(genotypeFile);
        info = JSON.stringify(JSON.stringify(info));
        select_qtls_samples = JSON.stringify(select_qtls_samples);
        // console.log("Expression File:", expressionFile);
        // console.log("Genotype File:", genotypeFile);

        logger.info("Expression File:", expressionFile);
        logger.info("Genotype File:", genotypeFile);
    
        var code = readFileSync(rfile).toString();
        // make sure the R statement below is not appended to a comment in R code file
        code += `locus_alignment_boxplots(${workingDirectory}, ${select_qtls_samples}, ${expressionFile}, ${genotypeFile}, ${info})`;

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 }, // increase default maxBuffer from ~4kb to 100mb
            (error, stdout, stderr) => {
                try {
                    if (stdout) {
                        var parsed = JSON.parse(JSON.parse(stdout));
                        // console.log(parsed);
                        logger.info("Resolve parsed obj keys:", Object.keys(parsed));
                        resolve(parsed);
                    } else {
                        if (error) reject(error);
                        if (stderr) reject(stderr);
                    }
                } catch(error) {
                    reject(error.toString());
                }
            }
        );
    });
}

function qtlsCalculateLocusColocalizationECAVIAR(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request) {
    // console.log("Execute qtls locus colocalization eCAVIAR calculation.");
    logger.info("Execute qtls locus colocalization eCAVIAR calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        // console.log("R Working directory:", workingDirectory);
        logger.info("R Working directory:", workingDirectory);

        gwasFile = JSON.stringify(gwasFile);
        associationFile = JSON.stringify(associationFile);
        LDFile = JSON.stringify(LDFile);
        select_ref = JSON.stringify(select_ref);
        select_dist = JSON.stringify(select_dist);
        request = JSON.stringify(request);
        select_gwas_sample = JSON.stringify(select_gwas_sample);
        select_qtls_samples = JSON.stringify(select_qtls_samples);

        // console.log("Selected GWAS Sample File:", select_gwas_sample);
        // console.log("Selected QTLs Sample Files:", select_qtls_samples);
        // console.log("GWAS File:", gwasFile);
        // console.log("Association File:", associationFile);
        // console.log("LD File:", LDFile);
        // console.log("Selected Ref:", select_ref);
        // console.log("Selected Dist:", select_dist);
        // console.log("Request:", request);

        logger.info("Selected GWAS Sample File:", select_gwas_sample);
        logger.info("Selected QTLs Sample Files:", select_qtls_samples);
        logger.info("GWAS File:", gwasFile);
        logger.info("Association File:", associationFile);
        logger.info("LD File:", LDFile);
        logger.info("Selected Ref:", select_ref);
        logger.info("Selected Dist:", select_dist);
        logger.info("Request:", request);
    
        var code = readFileSync(rfile).toString();
        // make sure the R statement below is not appended to a comment in R code file
        code += `locus_colocalization_eCAVIAR(${workingDirectory}, ${select_gwas_sample}, ${select_qtls_samples}, ${gwasFile}, ${associationFile}, ${LDFile}, ${select_ref}, ${select_dist}, ${request})`;

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 }, // increase default maxBuffer from ~4kb to 100mb
            (error, stdout, stderr) => {
                try {
                    if (stdout) {
                        var parsed = JSON.parse(JSON.parse(stdout));
                        // console.log(parsed);
                        logger.info("Resolve parsed obj keys:", Object.keys(parsed));
                        resolve(parsed);
                    } else {
                        if (error) reject(error);
                        if (stderr) reject(stderr);
                    }
                } catch(error) {
                    reject(error.toString());
                }
            }
        );
    });
}

function qtlsCalculateLocusColocalizationHyprcolocLD(rfile, ldfile, select_ref, select_chr, select_pos, select_dist, request) {
    // console.log("Execute qtls locus colocalization Hyprcoloc LD calculation.");
    logger.info("Execute qtls locus colocalization Hyprcoloc LD calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        // console.log("R Working directory:", workingDirectory);
        logger.info("R Working directory:", workingDirectory);

        ldfile = JSON.stringify(ldfile);
        select_ref = JSON.stringify(select_ref);
        select_chr = JSON.stringify(select_chr);
        select_pos = JSON.stringify(select_pos);
        select_dist = JSON.stringify(select_dist);
        request = JSON.stringify(request);

        // console.log("LD File:", ldfile);
        // console.log("Selected Ref:", select_ref);
        // console.log("Selected Chr:", select_chr);
        // console.log("Selected Pos:", select_pos);
        // console.log("Selected Dist:", select_dist);
        // console.log("Request:", request);

        logger.info("LD File:", ldfile);
        logger.info("Selected Ref:", select_ref);
        logger.info("Selected Chr:", select_chr);
        logger.info("Selected Pos:", select_pos);
        logger.info("Selected Dist:", select_dist);
        logger.info("Request:", request);
    
        var code = readFileSync(rfile).toString();
        // make sure the R statement below is not appended to a comment in R code file
        code += `locus_colocalization_hyprcoloc_ld(${workingDirectory}, ${ldfile}, ${select_ref}, ${select_chr}, ${select_pos}, ${select_dist}, ${request})`;

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 }, // increase default maxBuffer from ~4kb to 100mb
            (error, stdout, stderr) => {
                try {
                    if (stdout) {
                        var parsed = JSON.parse(JSON.parse(stdout));
                        // console.log(parsed);
                        logger.info("Resolve parsed obj keys:", Object.keys(parsed));
                        resolve(parsed);
                    } else {
                        if (error) reject(error);
                        if (stderr) reject(stderr);
                    }
                } catch(error) {
                    reject(error.toString());
                }
            }
        );
    });
}

function qtlsCalculateLocusColocalizationHyprcoloc(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldfile, request) {
    // console.log("Execute qtls locus colocalization Hyprcoloc calculation.");
    logger.info("Execute qtls locus colocalization Hyprcoloc calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        // console.log("R Working directory:", workingDirectory);
        logger.info("R Working directory:", workingDirectory);

        select_gwas_sample = JSON.stringify(select_gwas_sample);
        select_qtls_samples = JSON.stringify(select_qtls_samples);
        gwasFile = JSON.stringify(gwasFile);
        associationFile = JSON.stringify(associationFile);
        ldfile = JSON.stringify(ldfile);
        request = JSON.stringify(request);

        // console.log("Selected GWAS Sample File:", select_gwas_sample);
        // console.log("Selected QTLs Sample Files:", select_qtls_samples);
        // console.log("GWAS File:", gwasFile);
        // console.log("Association File:", associationFile);
        // console.log("LD File:", ldfile);
        // console.log("Request:", request);

        logger.info("Selected GWAS Sample File:", select_gwas_sample);
        logger.info("Selected QTLs Sample Files:", select_qtls_samples);
        logger.info("GWAS File:", gwasFile);
        logger.info("Association File:", associationFile);
        logger.info("LD File:", ldfile);
        logger.info("Request:", request);
    
        var code = readFileSync(rfile).toString();
        // make sure the R statement below is not appended to a comment in R code file
        code += `locus_colocalization_hyprcoloc(${workingDirectory}, ${select_gwas_sample}, ${select_qtls_samples}, ${gwasFile}, ${associationFile}, ${ldfile}, ${request})`;

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 }, // increase default maxBuffer from ~4kb to 100mb
            (error, stdout, stderr) => {
                try {
                    if (stdout) {
                        var parsed = JSON.parse(JSON.parse(stdout));
                        // console.log(parsed);
                        logger.info("Resolve parsed obj keys:", Object.keys(parsed));
                        resolve(parsed);
                    } else {
                        if (error) reject(error);
                        if (stderr) reject(stderr);
                    }
                } catch(error) {
                    reject(error.toString());
                }
            }
        );
    });
}

module.exports = {
    qtlsCalculateMain,
    qtlsCalculateLocusAlignmentBoxplots,
    qtlsCalculateLocusColocalizationECAVIAR,
    qtlsCalculateLocusColocalizationHyprcolocLD,
    qtlsCalculateLocusColocalizationHyprcoloc
};