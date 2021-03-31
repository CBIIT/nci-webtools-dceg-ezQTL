const XLSX = require('xlsx');
const spawn = require('child_process').spawn;

// this script accepts and excel file path containing a mapping of file for GTEx study
// the excel file is parsed to json so that the file path can be use to progamatically upload each one to s3
// this script is intended to be copied onto your Biowulf Helix user directory for use
// be sure to setup configure AWS in your environemnt ahead of time and install the node packages imported above
// verify files are uploaded in aws cli or on your browser

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
    bucket: '',
    aws: {
      region: 'us-east-1',
      aws_access_key_id: '',
      aws_secret_access_key: '',
    },
  };

  console.log('uploading to s3...');

  let include = [];
  const root = '/data/Brown_lab/ZTW_KB_Datasets/vQTL2';

  Object.keys(fileMap).forEach((sheet) => {
    fileMap[sheet].map((row) => {
      const file = row.Biowulf_full_path;
      const index = row.Biowulf_full_path_index;

      include.push(
        `--include "${file.replace(root, '')}" --include "${index.replace(
          root,
          ''
        )}"`
      );
    });
  });

  const syncCMD = `module load aws; cd ${root}; aws s3 sync . s3://${
    config.bucket
  }/ezQTL/ --exclude "*" ${include.join(' ')}`;

  const cmd = spawn(syncCMD, { shell: true });

  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  cmd.on('exit', function (code) {
    console.log('Done');
    console.log('exited with code ' + code.toString());
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
