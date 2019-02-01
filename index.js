var express = require('express');
var multer = require('multer');

var fs = require('fs');
const { promisify } = require('util')
const removeFile = promisify(fs.unlink)

const rscript = require('./r-calculations/r-wrapper.js');

var app = express();

console.log("Starting server...");


// Upload files with file extension and original name
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = 'r-calculations/uploads/'
      // fs.mkdir(dir, err => cb(err, dir))
      cb(null, dir)
  },
  filename: function (req, file, cb) {
      let ext = ''; // set default extension (if any)
      let fname = Date.now();
      if (file.originalname.split(".").length > 1) { // checking if there is an extension or not.
          ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
          fname = file.originalname.split(".").slice(0,-1).join('.');
      }
      cb(null, fname + '.' + Date.now() + ext)
  }
});
var upload = multer({ storage: storage });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/upload-file', upload.any(), async (request, response) => {
  console.log(request.files);
  console.log("Files uploaded.");

  var associationFile = request.files[0].filename; // required file
  var expressionFile = 'false'; //optional data file
  var genotypeFile = 'false'; //optional data file
  var gwasFile = 'false'; //optional data file

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

  // if (request.files[1] !== undefined && request.files[2] !== undefined) {
  //   expressionFile = request.files[1].filename;
  //   genotypeFile = request.files[2].filename;
  // }
  // if (request.files[3] !== undefined) {
  //   gwasFile = request.files[3].filename;
  // }

  var dir = __dirname + '/r-calculations/uploads/'
  try {
    const data = await rscript('./r-calculations/eQTL/eqtl.1.r', associationFile, expressionFile, genotypeFile, gwasFile);
    // remove files from uploads folder when data is received from R
    await removeFile(dir + associationFile);
    // if (request.files[1] !== undefined && request.files[2] !== undefined) {
    //   await removeFile(dir + expressionFile);
    //   await removeFile(dir + genotypeFile);
    // }
    // if (request.files[3] !== undefined) {
    //   await removeFile(dir + gwasFile);
    // }
    if (request.files.length == 2) {
      await removeFile(dir + gwasFile);
    }
    if (request.files.length == 3) {
      await removeFile(dir + expressionFile);
      await removeFile(dir + genotypeFile);
    } 
    if (request.files.length == 4) {
      await removeFile(dir + expressionFile);
      await removeFile(dir + genotypeFile);
      await removeFile(dir + gwasFile);
    }
    response.json(data);
  } catch(err) {
    console.log(err);
    // remove files from uploads folder when data is received from R
    await removeFile(dir + associationFile);
    // if (request.files[1] !== undefined && request.files[2] !== undefined) {
    //   await removeFile(dir + expressionFile);
    //   await removeFile(dir + genotypeFile);
    // }
    // if (request.files[3] !== undefined) {
    //   await removeFile(dir + gwasFile);
    // }
    if (request.files.length == 2) {
      await removeFile(dir + gwasFile);
    }
    if (request.files.length == 3) {
      await removeFile(dir + expressionFile);
      await removeFile(dir + genotypeFile);
    } 
    if (request.files.length == 4) {
      await removeFile(dir + expressionFile);
      await removeFile(dir + genotypeFile);
      await removeFile(dir + gwasFile);
    }
    response.status(500);
    response.json(err.toString());
  }
});

app.use('/', express.static('static'));

app.listen(3000);