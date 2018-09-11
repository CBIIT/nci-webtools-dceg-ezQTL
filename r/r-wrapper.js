const { readFileSync, writeFileSync } = require('fs');
const { spawn, exec } = require('child_process');
const { fileSync } = require('tmp');

// function rscript(rfile, input) {
function rscript(rfile) {
    return new Promise((resolve, reject) => {

        // input = JSON.stringify(JSON.stringify(input));
        const code = readFileSync(rfile).toString();
        // const rcode = `
        //     input = jsonlite::fromJSON(${input});
        //     suppressWarnings(
        //         jsonlite::toJSON({${code}}, auto_unbox=T)
        //     )
        // `;
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