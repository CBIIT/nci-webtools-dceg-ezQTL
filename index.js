var express = require('express');
var multer = require('multer');

var fs = require('fs');

const rscript = require('./r-calculations/r-wrapper.js');

var app = express();

app.use(express.json());

console.log("Starting server...");


// Upload files with file extension and original name
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'r-calculations/tmp/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // fs.mkdir(dir, err => cb(err, dir))
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let ext = ''; // set default extension (if any)
    let fname = Date.now();
    if (file.originalname.split(".").length > 1) { // checking if there is an extension or not.
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        fname = file.originalname.split(".").slice(0,-1).join('.');
    }
    cb(null, fname + '.' + req.body.request_id + ext);
  }
});
var upload = multer({ storage: storage });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/eqtl-calculate-main', upload.any(), async (request, response) => {
  console.log(request.files);
  console.log("Main data files uploaded.");

  var associationFile = request.files[0].filename; // required file
  var expressionFile = 'false'; // optional data file
  var genotypeFile = 'false'; // optional data file
  var gwasFile = 'false'; // optional data file

  // assign filenames to variable depending on how many files are uploaded
  if (request.files.length == 2) {
    gwasFile = request.files[1].filename;
  }
  if (request.files.length == 3) {
    expressionFile = request.files[1].filename;
    genotypeFile = request.files[2].filename;
  } 
  if (request.files.length == 4) {
    expressionFile = request.files[1].filename;
    genotypeFile = request.files[2].filename;
    gwasFile = request.files[3].filename;
  }

  try {
    const data = await rscript.eqtlCalculateMain('./r-calculations/eQTL/eqtl.r', associationFile, expressionFile, genotypeFile, gwasFile);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.post('/eqtl-locuszoom-boxplots', async (request, response) => {
  console.log("Locuszoom boxplot info received.");
  console.log("REQUEST BODY - locuszoom boxplot point info");
  console.log(request.body);
  var info = request.body.boxplotDataDetailed;
  var expressionFile = request.body.expressionFile; // optional data file
  var genotypeFile = request.body.genotypeFile; // optional data file

  try {
    const data = await rscript.eqtlCalculateLocuszoomBoxplots('./r-calculations/eQTL/locuszoomBoxplots.r', expressionFile, genotypeFile, info);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

// app.use('/', express.static('static'));

app.listen(3000);