var express = require('express');
var multer = require('multer');

var fs = require('fs');

const rscript = require('./r-calculations/r-wrapper.js');

var app = express();

app.use(express.json());

console.log("Server started.");


// Upload files with file extension and original name
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmp_dir = 'r-calculations/tmp/';
    const static_tmp_dir = 'static/tmp/';
    if (!fs.existsSync(tmp_dir)) {
      fs.mkdirSync(tmp_dir);
    }
    if (!fs.existsSync(static_tmp_dir)) {
      fs.mkdirSync(static_tmp_dir);
    }
    // fs.mkdir(dir, err => cb(err, dir))
    cb(null, tmp_dir);
  },
  filename: function (req, file, cb) {
    let ext = ''; // set default extension (if any)
    let fname = Date.now();
    if (file.originalname.split(".").length > 1) { // checking if there is an extension or not.
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        fname = file.originalname.split(".").slice(0,-1).join('.');
    }
    cb(null, req.body.request_id + '.' + fname +  ext);
  }
});
var upload = multer({ storage: storage });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', function(request, response) {
//   // response.send("Hi");
//   console.log("Client connected.");

//   request.on("close", function() {
//     console.log("request closed unexpectedly");
//   });
  
//   request.on("end", function() {
//     console.log("request ended normally");
//   });
// });

app.post('/qtls-calculate-main', upload.any(), async (request, response) => {
  console.log("Main calculation reached.");
  // create tmp directories if do not exist
  const tmp_dir = 'r-calculations/tmp/';
  const static_tmp_dir = 'static/tmp/';
  if (!fs.existsSync(tmp_dir)) {
    fs.mkdirSync(tmp_dir);
  }
  if (!fs.existsSync(static_tmp_dir)) {
    fs.mkdirSync(static_tmp_dir);
  }

  var associationFile = 'false'; // required file
  var expressionFile = 'false'; // optional data file
  var genotypeFile = 'false'; // optional data file
  var gwasFile = 'false'; // optional data file
  var request_id = request.body.request_id;
  var select_pop = request.body.select_pop;
  var select_gene = request.body.select_gene;
  var select_ref = request.body.select_ref;
  var recalculateAttempt = request.body.recalculateAttempt;
  var recalculatePop = request.body.recalculatePop;
  var recalculateGene = request.body.recalculateGene;
  var recalculateRef = request.body.recalculateRef;
  var select_qtls_samples = request.body.select_qtls_samples;

  for (var i = 0; i < request.files.length; i++) {
    console.log(request.files[i]);
    if (request.files[i]['fieldname'] == 'association-file') {
      associationFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'expression-file') {
      expressionFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'genotype-file') {
      genotypeFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'gwas-file') {
      gwasFile = request.files[i].filename;
    }
  }

  try {
    const data = await rscript.qtlsCalculateMain('./r-calculations/QTLs/qtls.r', select_qtls_samples, associationFile, expressionFile, genotypeFile, gwasFile, request_id, select_pop, select_gene, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-recalculate-main', async (request, response) => {
  console.log("Recalculation info received.");

  var associationFile = request.body.associationFile;
  var expressionFile = request.body.expressionFile;
  var genotypeFile = request.body.genotypeFile;
  var gwasFile = request.body.gwasFile;
  var request_id = request.body.request_id;
  var select_pop = request.body.select_pop;
  var select_gene = request.body.select_gene;
  var select_ref = request.body.select_ref;
  var recalculateAttempt = request.body.recalculateAttempt;
  var recalculatePop = request.body.recalculatePop;
  var recalculateGene = request.body.recalculateGene;
  var recalculateRef = request.body.recalculateRef;
  var select_qtls_samples = request.body.select_qtls_samples;

  try {
    const data = await rscript.qtlsCalculateMain('./r-calculations/QTLs/qtls.r', select_qtls_samples, associationFile, expressionFile, genotypeFile, gwasFile, request_id, select_pop, select_gene, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-locus-alignment-boxplots', async (request, response) => {
  console.log("Locus Alignment boxplot info received.");
  console.log("REQUEST BODY - locus alignment boxplot point info");
  console.log(request.body);
  var info = request.body.boxplotDataDetailed;
  var expressionFile = request.body.expressionFile; // optional data file
  var genotypeFile = request.body.genotypeFile; // optional data file
  var select_qtls_samples = request.body.select_qtls_samples;
  // console.log("LOCUS ALIGNMENT BOXPLOT USE SAMPLE:", select_qtls_samples);
  // var expressionFile = "0000000000000.1q21_3.expression.txt"; // debug data file
  // var genotypeFile = "0000000000000.1q21_3.genotyping.txt"; // debug data file

  try {
    const data = await rscript.qtlsCalculateLocusAlignmentBoxplots('./r-calculations/QTLs/qtls.r', select_qtls_samples, expressionFile, genotypeFile, info);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.get('/ping', async (request, response) => {
  console.log("pong");
  response.send(true);
});

app.use('/', express.static('static'));

app.listen(3000);