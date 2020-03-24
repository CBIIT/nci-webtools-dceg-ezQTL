var express = require('express');
var multer = require('multer');
var fs = require('fs');
const rscript = require('./r-calculations/r-wrapper.js');
var logger = require('./logger');
var app = express();

// read config json file
var config = require('./config');

// ensure tmp, input, output, log directories exist
if (!fs.existsSync(config.tmp_dir)) {
  fs.mkdirSync(config.tmp_dir);
}
if (!fs.existsSync(config.input_dir)) {
  fs.mkdirSync(config.input_dir);
}
if (!fs.existsSync(config.static_output_dir)) {
  fs.mkdirSync(config.static_output_dir);
}
if (!fs.existsSync(config.log_dir)) {
  fs.mkdirSync(config.log_dir);
}

app.use(express.json());

// console.log("Server started.");
logger.info("Server started.");


// Upload files with file extension and original name
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ensure tmp, input, output, log directories exist
    if (!fs.existsSync(config.tmp_dir)) {
      fs.mkdirSync(config.tmp_dir);
    }
    if (!fs.existsSync(config.input_dir)) {
      fs.mkdirSync(config.input_dir);
    }
    if (!fs.existsSync(config.static_output_dir)) {
      fs.mkdirSync(config.static_output_dir);
    }
    if (!fs.existsSync(config.log_dir)) {
      fs.mkdirSync(config.log_dir);
    }
    cb(null, config.input_dir);
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

app.post('/qtls-calculate-main', upload.any(), async (request, response) => {
  // console.log("Main calculation reached.");
  logger.info("Main calculation reached.");
  // ensure tmp, input, output, log directories exist
  if (!fs.existsSync(config.tmp_dir)) {
    fs.mkdirSync(config.tmp_dir);
  }
  if (!fs.existsSync(config.input_dir)) {
    fs.mkdirSync(config.input_dir);
  }
  if (!fs.existsSync(config.static_output_dir)) {
    fs.mkdirSync(config.static_output_dir);
  }
  if (!fs.existsSync(config.log_dir)) {
    fs.mkdirSync(config.log_dir);
  }

  var associationFile = 'false'; // required data file
  var quantificationFile = 'false'; // optional data file
  var genotypeFile = 'false'; // optional data file
  var gwasFile = 'false'; // optional data file 
  var LDFile = 'false'; //optional data file
  var request_id = request.body.request_id;
  var select_pop = request.body.select_pop;
  var select_gene = request.body.select_gene;
  var select_dist = request.body.select_dist;
  var select_ref = request.body.select_ref;
  var recalculateAttempt = request.body.recalculateAttempt;
  var recalculatePop = request.body.recalculatePop;
  var recalculateGene = request.body.recalculateGene;
  var recalculateDist= request.body.recalculateDist;
  var recalculateRef = request.body.recalculateRef;
  var select_qtls_samples = request.body.select_qtls_samples;
  var select_gwas_sample = request.body.select_gwas_sample;

  for (var i = 0; i < request.files.length; i++) {
    // console.log(request.files[i]);
    logger.info(request.files[i]);
    if (request.files[i]['fieldname'] == 'association-file') {
      associationFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'quantification-file') {
      quantificationFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'genotype-file') {
      genotypeFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'gwas-file') {
      gwasFile = request.files[i].filename;
    }
    if (request.files[i]['fieldname'] == 'LD-file') {
      LDFile = request.files[i].filename;
    }
  }

  try {
    const data = await rscript.qtlsCalculateMain('./r-calculations/QTLs/qtls.r', select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request_id, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef);
    if (data['info']['messages']['errors'].length > 0) {
      var errorMessages = data['info']['messages']['errors'].join(" ");
      logger.info(errorMessages);
      response.status(500);
      response.json(errorMessages.toString());
    } else {
      response.json(data);
    }
  } catch(err) {
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-recalculate-main', async (request, response) => {
  // console.log("Recalculation info received.");
  logger.info("Recalculation info received.");

  var associationFile = request.body.associationFile;
  var quantificationFile = request.body.quantificationFile;
  var genotypeFile = request.body.genotypeFile;
  var gwasFile = request.body.gwasFile;
  var LDFile = request.body.LDFile;
  var request_id = request.body.request_id;
  var select_pop = request.body.select_pop;
  var select_gene = request.body.select_gene;
  var select_dist = request.body.select_dist;
  var select_ref = request.body.select_ref;
  var recalculateAttempt = request.body.recalculateAttempt;
  var recalculatePop = request.body.recalculatePop;
  var recalculateGene = request.body.recalculateGene;
  var recalculateDist = request.body.recalculateDist;
  var recalculateRef = request.body.recalculateRef;
  var select_qtls_samples = request.body.select_qtls_samples;
  var select_gwas_sample = request.body.select_gwas_sample;

  try {
    const data = await rscript.qtlsCalculateMain('./r-calculations/QTLs/qtls.r', select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request_id, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef);
    response.json(data);
  } catch(err) {
    // console.log(err);
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-locus-alignment-boxplots', async (request, response) => {
  // console.log("Locus Alignment boxplot info received.");
  // console.log("REQUEST BODY - locus alignment boxplot point info");
  // console.log(request.body);
  logger.info("Locus Alignment boxplot info received.");
  logger.info("REQUEST BODY - locus alignment boxplot point info");
  logger.info(request.body);
  var quantificationFile = request.body.quantificationFile;
  var genotypeFile =request.body.genotypeFile;
  var boxplotDataDetailed = request.body.boxplotDataDetailed;
  var select_qtls_samples = request.body.select_qtls_samples;

  try {
    const data = await rscript.qtlsCalculateLocusAlignmentBoxplots('./r-calculations/QTLs/qtls.r', select_qtls_samples, quantificationFile, genotypeFile, boxplotDataDetailed);
    response.json(data);
  } catch(err) {
    // console.log(err);
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-locus-colocalization-ecaviar', async (request, response) => {
  // console.log("Locus Colocalization eCAVIAR info received.");
  // console.log("REQUEST BODY - locus colocalization eCAVIAR info");
  // console.log(request.body);
  logger.info("Locus Colocalization eCAVIAR info received.");
  logger.info("REQUEST BODY - locus colocalization eCAVIAR info");
  logger.info(request.body);
  var select_gwas_sample = request.body.select_gwas_sample;
  var select_qtls_samples = request.body.select_qtls_samples;
  var gwasFile = request.body.gwasFile;
  var associationFile = request.body.associationFile;
  var LDFile = request.body.LDFile;
  var select_ref = request.body.select_ref;
  var select_dist = request.body.select_dist;
  var request_id = request.body.request_id;

  try {
    const data = await rscript.qtlsCalculateLocusColocalizationECAVIAR('./r-calculations/QTLs/qtls-locus-colocalization-ecaviar.r', select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request_id);
    response.json(data);
  } catch(err) {
    // console.log(err);
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-locus-colocalization-hyprcoloc-ld', async (request, response) => {
  // console.log("Locus Colocalization Hyprcoloc LD info received.");
  // console.log("REQUEST BODY - locus colocalization Hyprcoloc LD info");
  // console.log(request.body);
  logger.info("Locus Colocalization Hyprcoloc LD info received.");
  logger.info("REQUEST BODY - locus colocalization Hyprcoloc LD info");
  logger.info(request.body);
  var LDFile = request.body.LDFile;
  var select_ref = request.body.select_ref;
  var select_chr = request.body.select_chr;
  var select_pos = request.body.select_pos;
  var select_dist = request.body.select_dist;
  var request_id = request.body.request_id;

  try {
    const data = await rscript.qtlsCalculateLocusColocalizationHyprcolocLD('./r-calculations/QTLs/qtls-locus-colocalization-hyprcoloc-ld.r', LDFile, select_ref, select_chr, select_pos, select_dist, request_id);
    response.json(data);
  } catch(err) {
    // console.log(err);
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/qtls-locus-colocalization-hyprcoloc', async (request, response) => {
  // console.log("Locus Colocalization Hyprcoloc info received.");
  // console.log("REQUEST BODY - locus colocalization Hyprcoloc info");
  // console.log(request.body);
  logger.info("Locus Colocalization Hyprcoloc info received.");
  logger.info("REQUEST BODY - locus colocalization Hyprcoloc info");
  logger.info(request.body);
  var select_gwas_sample = request.body.select_gwas_sample;
  var select_qtls_samples = request.body.select_qtls_samples;
  var gwasFile = request.body.gwasFile;
  var associationFile = request.body.associationFile;
  var LDFile = request.body.LDFile;
  var request_id = request.body.request_id;

  try {
    const data = await rscript.qtlsCalculateLocusColocalizationHyprcoloc('./r-calculations/QTLs/qtls-locus-colocalization-hyprcoloc.r', select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, request_id);
    response.json(data);
  } catch(err) {
    // console.log(err);
    logger.info(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.get('/ping', async (request, response) => {
  // console.log("pong");
  logger.info("pong");
  response.send(true);
});

app.use('/', express.static('static'));

app.listen(3000);