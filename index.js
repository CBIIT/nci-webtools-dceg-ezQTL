var express = require('express');
var multer = require('multer');

var fs = require('fs');
const { exec } = require('child_process');
// const { fileSync } = require('tmp');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const rscript = require('./r-calculations/r-wrapper.js');

var app = express();


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
  console.log('Files uploaded: ', request.files[0].filename, request.files[1].filename, request.files[2].filename);
  var expressionFile = request.files[0].filename;
  var genotypeFile = request.files[1].filename;
  var associationFile = request.files[2].filename;
  try {
    const data = await rscript('./r-calculations/eQTL/eqtl.r', expressionFile, genotypeFile, associationFile);
    // remove files from uploads folder when data is received from R
    var dir = __dirname + '/r-calculations/uploads/'
    await unlinkAsync(dir + expressionFile);
    await unlinkAsync(dir + genotypeFile);
    await unlinkAsync(dir + associationFile);
    response.json(data);
  } catch(err) {
    console.log(err);
    response.status(500);
    response.json(err.toString());
  }
});

app.use('/', express.static('static'));

app.listen(3000);