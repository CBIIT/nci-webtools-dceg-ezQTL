const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

function forkCluster(numProcesses) {
    if (!cluster.isMaster)
        return false;

    if (!numProcesses)
        numProcesses = numCPUs;
    
    for (let i = 0; i < numCPUs; i++)
        cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    });

    return true;
}

module.exports = { forkCluster };