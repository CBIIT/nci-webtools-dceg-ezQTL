const { readFileSync, writeFileSync } = require('fs');
const { spawn } = require('child_process');
const { fileSync } = require('tmp');

function rscript(rfile, input) {
    return new Promise((resolve, reject) => {

        input = JSON.stringify(JSON.stringify(input));
        const code = readFileSync(rfile).toString();
        const rcode = `
            input = jsonlite::fromJSON(${input});
            suppressWarnings(
                jsonlite::toJSON({${code}}, auto_unbox=T)
            )
        `;

        // console.log(rcode);

        const tmpFile = fileSync();
        writeFileSync(tmpFile.name, rcode);

        const process = spawn('Rscript', ['--vanilla', tmpFile.name]);
        // process.stdout.on('data', e => resolve(JSON.parse(e.toString())));
        process.stdout.on('data', e =>
            // console.log(e.toString())
            resolve(JSON.parse(e.toString()))
            // resolve(e.toString())
        );
        process.stderr.on('data', e => reject(e.toString()));
    });
}

module.exports = rscript;