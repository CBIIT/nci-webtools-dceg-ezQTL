const rscript = require('./r/r-wrapper.js');

async function test() {
    const result = await rscript('./r/test.r', 'hello');
    console.log(result);
}

test();