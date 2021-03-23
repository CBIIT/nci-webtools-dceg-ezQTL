const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const XLSX = require('xlsx');

// this script accepts and excel file path containing a mapping of file for GTEx study
// the excel file is parsed to json so that the file path can be use to progamatically
// upload each one to s3
// this script is intended to be copied onto your Biowulf Helix user directory for use
// be sure to setup configure AWS in your environemnt ahead of time and install the node packages
// imported above
// this script only has error output, verify files are uploaded in aws cli or on your browser

try {
  if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' EXCEL_FILE');
    process.exit(1);
  }

  const excelFile = process.argv[2];

  const workbook = XLSX.readFile(excelFile);
  const sheetNames = workbook.SheetNames;
  const fileMap = sheetNames.reduce(
    (acc, sheet) => ({
      ...acc,
      [sheet]: XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
    }),
    {}
  );

  // add bucket name and aws credentials if necessary
  const config = {
    bucket: 'dataBucket',
    aws: {
      region: 'us-east-1',
      aws_access_key_id: '',
      aws_secret_access_key: '',
    },
  };

  AWS.config.update(config.aws);
  const s3 = new AWS.S3();

  console.log('uploading to s3...');

  Object.keys(fileMap).forEach(async (sheet) => {
    const uploadAll = await Promise.all(
      fileMap[sheet].map(async (row) => {
        try {
          // remove begining of file path
          const replacePath = '/data/Brown_lab/ZTW_KB_Datasets/vQTL2';
          const file = row.Biowulf_full_path;
          const index = row.Biowulf_full_path_index;

          return await Promise.all([
            s3
              .upload({
                Bucket: config.bucket,
                Key: `ezQTL${file.replace(replacePath, '')}`,
                Body: fs.createReadStream(path.resolve(file)),
              })
              .promise(),
            s3
              .upload({
                Bucket: config.bucket,
                Key: `ezQTL${index.replace(replacePath, '')}`,
                Body: fs.createReadStream(path.resolve(index)),
              })
              .promise(),
          ]);
        } catch (err) {
          console.log(`Failed to upload ${row.Filename}`);
          // console.log(err);
          return [];
        }
      })
    );
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
