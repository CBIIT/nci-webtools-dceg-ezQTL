var express = require('express');
var multer = require('multer');

const { readFileSync, writeFileSync } = require('fs');
const { spawn } = require('child_process');
const { fileSync } = require('tmp');

const rscript = require('./r/r-wrapper.js');

var app = express();

// Upload files with file extension and original name
// var upload = multer({dest: 'uploads/'})
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = 'uploads/'
      // fs.mkdir(dir, err => cb(err, dir))
      cb(null, dir)
  },
  filename: function (req, file, cb) {
      let ext = ''; // set default extension (if any)
      let fname = Date.now();
      if (file.originalname.split(".").length > 1) {// checking if there is an extension or not.
          ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
          fname = file.originalname.split(".").slice(0,-1).join('.');
      }
      cb(null, fname + ext)
  }
});
var upload = multer({ storage: storage });

// var requestTime = function (req, res, next) {
//   req.requestTime = Date.now()
//   next()
// }

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.post('/upload-file', upload.any(), async (request, response) => {

  request.files.forEach(function(file) {
    console.log(file.originalname + ' has been uploaded');
  });
  const data = await rscript('./r/gene-expressions.r');
  response.json(data)
});

// async function test() {
//   const result = await rscript('./r/gene-expressions.r');
//   console.log(result);
//   return result;
// }

app.get('/', function (req, res) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  responseText = `
    <form id="some-form">
      <input id="some-file" type="file" name="some-file">
      <button id="click-me">Upload</button>
    </form>
    <script>
      var form = document.querySelector('#some-form');
      var someFile = document.querySelector('#some-file');
      var clickMe = document.querySelector('#click-me');
      function getFormData(form) {
        var inputs = Array.from(form.querySelectorAll('input,textarea'));
        var formData = new FormData();
        for (let input of inputs) {
          if (input.type === 'file')
            formData.append(input.name, input.files[0]);
          else
            formData.append(input.name, input.value);
        }
        return formData;
      }
      clickMe.onclick = async function() {
        if(!someFile.files) return;
        var formData = getFormData(form);

        var response = await fetch('/upload-file', {
          method: 'POST',
          body: formData
        });
        console.log(await response.text());
      }
    </script>
  `
  res.send(responseText)
});

app.listen(3000);