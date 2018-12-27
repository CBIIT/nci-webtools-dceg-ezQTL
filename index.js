var express = require('express');
var multer = require('multer');

var fs = require('fs');
const { promisify } = require('util')
const removeFile = promisify(fs.unlink)

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
  console.log(request.files);
  console.log('Files uploaded: ', request.files[0].filename, request.files[1].filename, request.files[2].filename, request.files[3].filename);
  var associationFile = request.files[0].filename;
  var expressionFile = request.files[1].filename;
  var genotypeFile = request.files[2].filename;
  var gwasFile = request.files[3].filename;
  var dir = __dirname + '/r-calculations/uploads/'
  try {
    const data = await rscript('./r-calculations/eQTL/eqtl.r', expressionFile, genotypeFile, associationFile, gwasFile);
    // remove files from uploads folder when data is received from R
    await removeFile(dir + associationFile);
    await removeFile(dir + expressionFile);
    await removeFile(dir + genotypeFile);
    await removeFile(dir + gwasFile);
    response.json(data);
  } catch(err) {
    console.log(err);
    // remove files from uploads folder when data is received from R
    await removeFile(dir + associationFile);
    await removeFile(dir + expressionFile);
    await removeFile(dir + genotypeFile);
    await removeFile(dir + gwasFile);
    response.status(500);
    response.json(err.toString());
  }
});

app.use('/', express.static('static'));

app.listen(3000);