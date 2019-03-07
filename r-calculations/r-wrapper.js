const { readFileSync, writeFileSync } = require('fs');
const { exec } = require('child_process');
const { fileSync } = require('tmp');

function eqtlCalculateMain(rfile, associationFile, expressionFile, genotypeFile, gwasFile, request, select_pop, select_gene, select_ref, recalculatePopGene, recalculateLD) {
    console.log("Execute main eqtl calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        console.log("R Working directory:", workingDirectory);

        associationFile = JSON.stringify(associationFile);
        expressionFile = JSON.stringify(expressionFile);
        genotypeFile = JSON.stringify(genotypeFile);
        gwasFile = JSON.stringify(gwasFile);
        request = JSON.stringify(request);
        select_pop = JSON.stringify(select_pop);
        select_gene = JSON.stringify(select_gene);
        select_ref = JSON.stringify(select_ref);
        recalculatePopGene = JSON.stringify(recalculatePopGene);
        recalculateLD = JSON.stringify(recalculateLD);


        console.log("Association File:", associationFile);
        console.log("Expression File:", expressionFile);
        console.log("Genotype File:", genotypeFile);
        console.log("GWAS File:", gwasFile);
        console.log("Request: ", request);
        // var debugRequest = JSON.stringify("0000000000000");
        // console.log("Debug Request: ", debugRequest);
        console.log("Selected Pop: ", select_pop);
        console.log("Selected Gene: ", select_gene);
        console.log("Selected Ref: ", select_ref);
        console.log("Recalculate Pop/Gene?", recalculatePopGene);
        console.log("Recalculate LD?", recalculateLD);

        var code = readFileSync(rfile).toString();
        
        // make sure the R statement below is not appended to a comment in R code file
        // code += `eqtl_main(${workingDirectory}, ${associationFile}, ${expressionFile}, ${genotypeFile}, ${gwasFile}, ${debugRequest}, ${request}, ${select_pop})`;
        code += `eqtl_main(${workingDirectory}, ${associationFile}, ${expressionFile}, ${genotypeFile}, ${gwasFile}, ${request}, ${select_pop}, ${select_gene}, ${select_ref}, ${recalculatePopGene}, ${recalculateLD})`;
        // console.log(code);

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
                        console.log(parsed);
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

function eqtlCalculateLocuszoomBoxplots(rfile, expressionFile, genotypeFile, info) {
    console.log("Execute eqtl locuszoom boxplots calculation.");
    return new Promise((resolve, reject) => {
        const workingDirectory = JSON.stringify(__dirname);
        console.log("R Working directory:", workingDirectory);

        expressionFile = JSON.stringify(expressionFile);
        genotypeFile = JSON.stringify(genotypeFile);
        // expressionFile = JSON.stringify("1q21_3.expression.txt");
        // genotypeFile = JSON.stringify("1q21_3.genotyping.txt");
        info = JSON.stringify(JSON.stringify(info));
        console.log("Expression File:", expressionFile);
        console.log("Genotype File:", genotypeFile);
        // console.log("Info:", info);
        // console.log("Request:", request);
    
        var code = readFileSync(rfile).toString();
        
        // make sure the R statement below is not appended to a comment in R code file
        code += `eqtl_locuszoom_boxplots(${workingDirectory}, ${expressionFile}, ${genotypeFile}, ${info})`;
        // console.log(code);

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
                        console.log(parsed);
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
    eqtlCalculateMain,
    eqtlCalculateLocuszoomBoxplots
};