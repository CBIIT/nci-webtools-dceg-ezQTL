const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const r = require('r-wrapper').async;
const tar = require('tar');
const config = require('./config.json');
const logger = require('./services/logger');
const { calculateMain } = require('./services/calculate');

const workingDirectory = path.resolve(config.R.workDir);

(async function main() {
  // update aws configuration if all keys are supplied, otherwise
  // fall back to default credentials/IAM role
  if (config.aws) {
    AWS.config.update(config.aws);
  }

  // create required folders
  for (let folder of [config.logs.folder, config.tmp.folder]) {
    fs.mkdirSync(folder, { recursive: true });
  }

  receiveMessage();
})();

/**
 * Reads a template, substituting {tokens} with data values
 * @param {string} filepath
 * @param {object} data
 */
async function readTemplate(filePath, data) {
  const template = await fs.promises.readFile(path.resolve(filePath));

  // replace {tokens} with data values or removes them if not found
  return String(template).replace(
    /{[^{}]+}/g,
    (key) => data[key.replace(/[{}]+/g, '')] || ''
  );
}

/**
 * Writes the contents of a stream to a file and resolves once complete
 * @param {*} readStream
 * @param {*} filePath
 */
function streamToFile(readStream, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const stream = readStream.pipe(file);
    stream.on('error', (error) => reject(error));
    stream.on('close', (_) => resolve());
  });
}

/**
 * Downloads work files from s3 for calculation
 * @param {string} request
 * @param {string} savePath
 */
async function downloadS3(request, savePath) {
  const s3 = new AWS.S3();
  const objects = await s3
    .listObjectsV2({
      Bucket: config.aws.s3.queue,
      Prefix: `${config.aws.s3.inputPrefix}/${request}/`,
    })
    .promise();

  // download work files
  for (let { Key } of objects.Contents) {
    const filename = path.basename(Key);
    const filepath = path.resolve(savePath, filename);

    logger.info(`Downloading: ${Key} to ${savePath}`);
    const object = await s3
      .getObject({
        Bucket: config.aws.s3.queue,
        Key,
      })
      .promise();

    await fs.promises.writeFile(filepath, object.Body);
    // extract and delete archive
    if (path.extname(filename) == '.tgz') {
      fs.createReadStream(filepath)
        .pipe(tar.x({ strip: 1, C: savePath }))
        .once('finish', () =>
          fs.unlink(filepath, (e) => {
            if (e) logger.error(e);
          })
        );
    }
  }
}

/**
 * Processes a message and sends emails when finished
 * @param {object} params
 */
async function processSingleLocus(params) {
  const { request, timestamp } = params;
  const s3 = new AWS.S3();
  const mailer = nodemailer.createTransport(config.email.smtp);

  // logger.debug(params);
  try {
    // Setup folders
    const directory = path.resolve(config.tmp.folder, request);
    await fs.promises.mkdir(directory, { recursive: true });

    logger.info('Start Calculation');

    const start = new Date().getTime();
    await downloadS3(request, directory);

    const main = JSON.parse(
      await calculateMain({
        workingDirectory: workingDirectory,
        bucket: config.aws.s3.data,
        ...params,
      })
    );

    logger;
    const end = new Date().getTime();

    logger.info('Calculation Done');

    const time = end - start;
    const minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);

    const runtime = (minutes > 0 ? minutes + ' min ' : '') + seconds + ' secs';

    // upload parameters
    await s3
      .upload({
        Body: JSON.stringify({ params: params, main: main }),
        Bucket: config.aws.s3.queue,
        Key: `${config.aws.s3.outputPrefix}/${request}/params.json`,
      })
      .promise();

    // upload archived project directory
    await s3
      .upload({
        Body: tar
          .c({ sync: true, gzip: true, C: config.tmp.folder }, [request])
          .read(),
        Bucket: config.aws.s3.queue,
        Key: `${config.aws.s3.outputPrefix}/${request}/${request}.tgz`,
      })
      .promise();

    // specify email template variables
    const templateData = {
      jobName: 'ezQTL',
      originalTimestamp: timestamp,
      runTime: runtime,
      resultsUrl: `${config.email.baseUrl}/#/qtls/${request}`,
      supportEmail: config.email.admin,
    };

    // send user success email
    logger.info(`Sending user success email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.sender,
      to: params.email,
      subject: `ezQTL Results - ${timestamp} EST`,
      html: await readTemplate(
        __dirname + '/templates/user-success-email.html',
        templateData
      ),
    });

    return true;
  } catch (err) {
    logger.error(err);

    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';

    // template variables
    const templateData = {
      request: request,
      parameters: JSON.stringify(params, null, 4),
      originalTimestamp: timestamp,
      exception: err.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: config.email.admin,
    };

    // send admin error email
    logger.info(`Sending admin error email`);
    const adminEmailResults = await mailer.sendMail({
      from: config.email.sender,
      to: config.email.admin,
      subject: `ezQTL Error: ${request} - ${timestamp} EST`, // searchable calculation error subject
      html: await readTemplate(
        __dirname + '/templates/admin-failure-email.html',
        templateData
      ),
    });

    // send user error email
    if (params.email) {
      logger.info(`Sending user error email`);
      const userEmailResults = await mailer.sendMail({
        from: config.email.sender,
        to: params.email,
        subject: 'ezQTL Error',
        html: await readTemplate(
          __dirname + '/templates/user-failure-email.html',
          templateData
        ),
      });
    }

    return false;
  }
}

async function processMultiLoci(data) {
  const { paramsArr, requests, email, timestamp } = data;
  const s3 = new AWS.S3();
  const mailer = nodemailer.createTransport(config.email.smtp);

  // logger.debug(params);
  try {
    // Setup folders
    const calculations = await Promise.all(
      paramsArr.map(async (params, i) => {
        try {
          const { request, jobName } = params;

          const directory = path.resolve(config.tmp.folder, request);
          await fs.promises.mkdir(directory, { recursive: true });

          logger.info(`Calculating: ${jobName} ${request}`);

          const start = new Date().getTime();
          await downloadS3(request, directory);

          const main = JSON.parse(
            await calculateMain({
              workingDirectory: workingDirectory,
              bucket: config.aws.s3.data,
              ...params,
            })
          );
          const end = new Date().getTime();

          logger.info('Calculation Done');

          const time = end - start;
          const minutes = Math.floor(time / 60000);
          var seconds = ((time % 60000) / 1000).toFixed(0);

          const runtime =
            (minutes > 0 ? minutes + ' min ' : '') + seconds + ' secs';

          // upload parameters
          await s3
            .upload({
              Body: JSON.stringify({ params: params, main: main }),
              Bucket: config.aws.s3.queue,
              Key: `${config.aws.s3.outputPrefix}/${request}/params.json`,
            })
            .promise();

          // upload archived project directory
          await s3
            .upload({
              Body: tar
                .c({ sync: true, gzip: true, C: config.tmp.folder }, [request])
                .read(),
              Bucket: config.aws.s3.queue,
              Key: `${config.aws.s3.outputPrefix}/${request}/${request}.tgz`,
            })
            .promise();

          return Promise.resolve({
            jobName: jobName,
            runtime: runtime,
            request: request,
            index: i,
          });
        } catch (error) {
          logger.error(error);
          return Promise.resolve({ jobName: jobName, error: error, index: i });
        }
      })
    );

    const template = calculations.map((data, i) => {
      if (data.error) {
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Error: ${data.error}</li>
                </ul>`;
      } else {
        const resultsUrl = `${config.email.baseUrl}/#/qtls/${data.request}`;
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Execution Time: ${data.runtime}</li>
                  <li>Results: <a href="${resultsUrl}">${resultsUrl}</a></li><br />
                </ul>`;
      }
    });

    // specify email template variables
    const templateData = {
      results: template.join(''),
      supportEmail: config.email.admin,
    };

    // send user success email
    logger.info(`Sending user success email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.sender,
      to: email,
      subject: `ezQTL Results - ${timestamp} EST`,
      html: await readTemplate(
        __dirname + '/templates/user-multi-email.html',
        templateData
      ),
    });

    return true;
  } catch (err) {
    logger.error(err);

    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';

    // template variables
    const templateData = {
      request: requests[0],
      parameters: JSON.stringify(params, null, 4),
      originalTimestamp: timestamp,
      exception: err.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: config.email.admin,
    };

    // send admin error email
    logger.info(`Sending admin error email`);
    const adminEmailResults = await mailer.sendMail({
      from: config.email.sender,
      to: config.email.admin,
      subject: `ezQTL Error: ${request} - ${timestamp} EST`, // searchable calculation error subject
      html: await readTemplate(
        __dirname + '/templates/admin-failure-email.html',
        templateData
      ),
    });

    // send user error email
    if (params.email) {
      logger.info(`Sending user error email`);
      const userEmailResults = await mailer.sendMail({
        from: config.email.sender,
        to: params.email,
        subject: 'ezQTL Error',
        html: await readTemplate(
          __dirname + '/templates/user-failure-email.html',
          templateData
        ),
      });
    }

    return false;
  }
}

/**
 * Receives messages from the queue at regular intervals,
 * specified by config.pollInterval
 */
async function receiveMessage() {
  const sqs = new AWS.SQS();

  try {
    // to simplify running multiple workers in parallel,
    // fetch one message at a time
    const { QueueUrl } = await sqs
      .getQueueUrl({ QueueName: config.aws.sqs.url })
      .promise();

    const data = await sqs
      .receiveMessage({
        QueueUrl: QueueUrl,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: config.aws.sqs.visibilityTimeout,
        WaitTimeSeconds: 20,
      })
      .promise();

    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0];
      const params = JSON.parse(message.Body);

      logger.info(`Received Message ${params.request || params.requests[0]}`);
      // logger.debug(message.Body);

      // while processing is not complete, update the message's visibilityTimeout
      const intervalId = setInterval(
        (_) =>
          sqs
            .changeMessageVisibility({
              QueueUrl: QueueUrl,
              ReceiptHandle: message.ReceiptHandle,
              VisibilityTimeout: config.aws.sqs.visibilityTimeout,
            })
            .send(),
        1000 * (config.aws.sqs.visibilityTimeout - 1)
      );

      // processSingleLocus should return a boolean status indicating success or failure

      const status = params.multi
        ? await processMultiLoci(params)
        : await processSingleLocus(params);
      clearInterval(intervalId);

      // if message was not processed successfully, send it to the
      // error queue (add metadata in future if needed)
      //   if (!status && config.queue.errorUrl) {
      //     // generate new unique request for error message
      //     const request = crypto.randomBytes(16).toString('hex');
      //     await sqs
      //       .sendMessage({
      //         QueueUrl: config.queue.errorUrl,
      //         MessageDeduplicationId: request,
      //         MessageGroupId: request,
      //         MessageBody: JSON.stringify(params),
      //       })
      //       .promise();
      //   }

      // remove original message from queue once processed
      await sqs
        .deleteMessage({
          QueueUrl: QueueUrl,
          ReceiptHandle: message.ReceiptHandle,
        })
        .promise();
    }
  } catch (e) {
    // catch exceptions related to sqs
    logger.error(e);
  } finally {
    // schedule receiving next message
    setTimeout(receiveMessage, 1000 * (config.aws.sqs.pollInterval || 60));
  }
}
