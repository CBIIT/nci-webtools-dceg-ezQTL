const { readFileSync, writeFileSync } = require('fs');
const { spawn, exec } = require('child_process');
const { fileSync } = require('tmp');

// function rscript(rfile, input) {
function rscript(rfile, expressionFile, genotypeFile, associationFile) {
    console.log('Files reached R-Wrapper:', expressionFile, genotypeFile, associationFile);
    var workingDirectory = JSON.stringify(__dirname);
    console.log('R Working directory:', workingDirectory);
    return new Promise((resolve, reject) => {

        expressionFile = JSON.stringify(expressionFile);
        genotypeFile = JSON.stringify(genotypeFile);
        associationFile = JSON.stringify(associationFile);

        // const code = readFileSync(rfile).toString();
        var code = readFileSync(rfile).toString();
        
        // const rcode = `
        //     input = jsonlite::fromJSON(${input});
        //     suppressWarnings(
        //         jsonlite::toJSON({${code}}, auto_unbox=T)
        //     )
        // `;

        // genotypeFile = jsonlite::fromJSON(${genotypeFile});
        // associationFile = jsonlite::fromJSON(${associationFile});
        code = code.replace(/workingDirectory/g, workingDirectory);
        code = code.replace(/expressionFile/g, expressionFile);
        code = code.replace(/genotypeFile/g, genotypeFile);
        code = code.replace(/associationFile/g, associationFile);
        console.log(code);

        const rcode = `
            suppressWarnings(suppressMessages(suppressPackageStartupMessages(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )))
        `;

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = exec(
            `Rscript --vanilla "${tmpFile.name}"`, 
            { maxBuffer: 100 * 1024 * 1024 },
            (error, stdout, stderr) => {
                if (error) reject(error);
                if (stderr) reject(stderr);
                resolve(JSON.parse(stdout.toString()));
            }
        );
    });
}

module.exports = rscript;