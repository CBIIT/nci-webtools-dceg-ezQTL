const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const r = require('r-wrapper').async;
const tar = require('tar');
var _ = require('lodash');
const config = require('./config.json');
const logger = require('./services/logger');
const {
  calculateQC,
  calculateMain,
  calculateHyprcolocLD,
  calculateLocusLD,
  calculateECAVIAR,
  calculateHyprcoloc,
  calculateColocVisualize,
} = require('./services/calculate');

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

function mergeState(state, data) {
  return _.mergeWith(state, data, (obj, src) => {
    if (_.isArray(obj)) {
      return src;
    }
  });
}

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

    logger.debug(`Downloading: ${Key} to ${savePath}`);
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

async function calculate(params) {
  const { request } = params;

  // qtlsCalculateQC
  await calculateQC({
    workingDirectory: workingDirectory,
    bucket: config.aws.s3.data,
    ...params,
  });
  const logPath = path.resolve(workingDirectory, 'tmp', request, 'ezQTL.log');
  let summary = '';
  if (fs.existsSync(logPath)) {
    summary = String(await fs.promises.readFile(logPath));
  }
  summary = summary.replace(/#/g, '\u2022');
  summary = summary.split('\n\n');

  let newParams = { ...params };
  if (params.associationFile || params.qtlKey || params.select_qtls_samples)
    params.associationFile = 'ezQTL_input_qtl.txt';
  if (params.LDFile || params.ldPublic || params.select_qtls_samples)
    params.LDFile = 'ezQTL_input_ld.gz';
  if (params.gwasFile || params.gwasKey || params.select_gwas_sample)
    params.gwasFile = 'ezQTL_input_gwas.txt';

  let state = {
    ...newParams,
    ldProject: { value: params.ldProject, label: params.ldProject },
    locus_qc: summary,
    locusInformation: [
      {
        select_dist: params.select_dist,
        select_ref: params.select_ref,
        select_position: params.select_position,
        select_chromosome: {
          value: params.select_chromosome,
          label: params.select_chromosome,
        },
      },
    ],
  };

  let main = {};
  if (params.associationFile || params.gwasFile) {
    // qtlsCalculateMain
    main = JSON.parse(
      await calculateMain({
        workingDirectory: workingDirectory,
        bucket: config.aws.s3.data,
        ...params,
      })
    );
    state = mergeState(state, {
      openSidebar: false,
      select_qtls_samples:
        main['info']['select_qtls_samples'][0] === 'true' ? true : false,
      select_gwas_sample:
        main['info']['select_gwas_sample'][0] === 'true' ? true : false,
      select_ref: main['locus_alignment']['top'][0][0]['rsnum'],
      recalculateAttempt:
        main['info']['recalculateAttempt'][0] === 'true' ? true : false,
      top_gene_variants: {
        data: main['info']['top_gene_variants']['data'][0],
      },
      all_gene_variants: {
        data: main['info']['all_gene_variants']['data'][0],
      },
      gene_list: {
        data: main['info']['gene_list']['data'][0],
      },
      inputs: main['info']['inputs'],
      messages: main['info']['messages'],
      locus_alignment: {
        top: main['locus_alignment']['top'][0][0],
      },
      locus_alignment_gwas_scatter_threshold: 0.0,
      locus_colocalization_correlation: {
        data: main['locus_colocalization_correlation']['data'][0],
      },
      gwas: {
        data: main['gwas']['data'][0],
      },
      locus_table: {
        data: main['locus_alignment']['data'][0],
        globalFilter: '',
      },
      isLoading: false,
    });

    // qtlsCalculateLocusColocalizationHyprcoloc
    try {
      if (params.LDFile) {
        const { hyprcoloc } = JSON.parse(
          await calculateHyprcoloc({
            workingDirectory: workingDirectory,
            bucket: config.aws.s3.data,
            request: request,
            select_gwas_sample: state.select_gwas_sample,
            select_qtls_samples: state.select_qtls_samples,
            select_dist: state.inputs.select_dist[0] * 1000,
            select_ref: state.locus_alignment.top.rsnum,
            gwasfile: state.inputs.gwas_file[0],
            qtlfile: state.inputs.association_file[0],
            ldfile: state.inputs.ld_file[0],
          })
        );

        state = mergeState(state, {
          hyprcoloc_table: {
            data: hyprcoloc['result_hyprcoloc']['data'][0],
          },
          hyprcolocSNPScore_table: {
            data: hyprcoloc['result_snpscore']['data'][0],
          },
        });
      }
    } catch (err) {
      logger.error(err);
    }

    // qtlsGWASECaviarCalculation
    try {
      const { ecaviar } = JSON.parse(
        await calculateECAVIAR({
          workingDirectory: workingDirectory,
          bucket: config.aws.s3.data,
          request: request,
          LDFile: state.inputs.ld_file[0],
          associationFile: state.inputs.association_file[0],
          gwasFile: state.inputs.gwas_file[0],
          select_dist: state.inputs.select_dist[0] * 1000,
          select_gwas_sample: state.select_gwas_sample,
          select_qtls_samples: state.select_qtls_samples,
          select_ref: state.locus_alignment.top.rsnum,
        })
      );

      state = mergeState(state, {
        ecaviar_table: {
          data: ecaviar['data'][0],
        },
      });
    } catch (err) {
      logger.error(err);
    }
    // qtlsColocVisualization - summary
    try {
      if (
        state.hyprcoloc_table.data.length > 0 &&
        state.ecaviar_table.data.length > 0
      ) {
        const colocSummary = await calculateColocVisualize({
          workingDirectory: workingDirectory,
          bucket: config.aws.s3.data,
          request: request,
          hydata: state.hyprcoloc_table.data,
          ecdata: state.ecaviar_table.data,
          LDFile: state.inputs['ld_file'][0],
          associationFile: state.inputs['association_file'][0],
          gwasFile: state.inputs['gwas_file'][0],
          select_dist: state.inputs['select_dist'][0] * 1000,
          select_gwas_sample: params.select_gwas_sample,
          select_qtls_samples: params.select_qtls_samples,
          select_ref: state.locus_alignment['top']['rsnum'],
          calcEcaviar: state.ecaviar_table.data.length === 0,
        });

        state = mergeState(state, {
          summaryLoaded: true,
        });
      }
    } catch (err) {
      logger.error(err);
    }
  }

  // qtlsGWASLocusLDCalculation
  try {
    if (params.LDFile || params.ldKey || params.select_qtls_samples) {
      const locusLD = await calculateLocusLD({
        workingDirectory: workingDirectory,
        bucket: config.aws.s3.data,
        request: request,
        select_gwas_sample: state.select_gwas_sample,
        select_qtls_samples: state.select_qtls_samples,
        gwasFile: params.gwasFile,
        associationFile: params.associationFile,
        LDFile: params.LDFile,
        leadsnp: state.locus_alignment
          ? state.locus_alignment.top.rsnum
          : newParams.select_ref,
        position: newParams.select_position,
        ldThreshold: state.ldThreshold,
        ldAssocData: state.ldAssocData,
        genome_build: params.genome_build,
      });
    }
  } catch (err) {
    logger.error(err);
  }

  return { state: state, main: main };
}

/**
 * Processes a message and sends emails when finished
 * @param {object} params
 */
async function processSingleLocus(requestData) {
  const { params, request, timestamp } = requestData;
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

    const { state, main } = await calculate(params);

    const end = new Date().getTime();

    logger.info('Calculation Done');

    const time = end - start;
    const minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);

    const runtime = (minutes > 0 ? minutes + ' min ' : '') + seconds + ' secs';

    // upload parameters
    await s3
      .upload({
        Body: JSON.stringify({ state: state, main: main }),
        Bucket: config.aws.s3.queue,
        Key: `${config.aws.s3.outputPrefix}/${request}/state.json`,
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
      jobName: params.jobName,
    };

    // send user success email
    logger.info(`Sending user success email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.admin,
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
      from: config.email.admin,
      to: config.email.support,
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
        from: config.email.admin,
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
  const { params: paramsArr, request: mainRequest, timestamp } = data;
  const email = paramsArr[0].email;

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

          logger.info(`Calculating: ${request}`);

          const start = new Date().getTime();

          // download user uploaded files into unique
          await downloadS3(mainRequest, directory);
          const { state, main } = await calculate(params);

          const end = new Date().getTime();

          logger.info(`${request} Done`);

          const time = end - start;
          const minutes = Math.floor(time / 60000);
          var seconds = ((time % 60000) / 1000).toFixed(0);

          const runtime =
            (minutes > 0 ? minutes + ' min ' : '') + seconds + ' secs';

          // upload parameters
          await s3
            .upload({
              Body: JSON.stringify({ state: state, main: main }),
              Bucket: config.aws.s3.queue,
              Key: `${config.aws.s3.outputPrefix}/${request}/state.json`,
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
          });
        } catch (error) {
          logger.error(error);
          const stdout = error.stdout ? error.stdout.toString() : '';
          const stderr = error.stderr ? error.stderr.toString() : '';

          return Promise.resolve({
            request: params.request,
            jobName: params.jobName,
            parameters: JSON.stringify(params, null, 4),
            exception: error.toString(),
            processOutput: !stdout && !stderr ? null : stdout + stderr,
          });
        }
      })
    );

    const template = calculations.map((data, i) => {
      if (data.exception) {
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Error - Failed to Process Job</li>
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
    logger.info(`Sending user multi results email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.admin,
      to: email,
      subject: `ezQTL Results - ${timestamp} EST`,
      html: await readTemplate(
        __dirname + '/templates/user-multi-email.html',
        templateData
      ),
    });

    // send admin failure email if needed
    const failed = calculations.filter((data) => data.exception);
    if (failed.length) {
      const errorsTemplate = failed.map(
        (data) => `<ul style="list-style-type: none">
                      <li><b>Request: </b>${data.request}</li>
                      <li><b>Job Name: </b>${data.jobName}</li>
                      <li><b>Parameters: </b></li>
                      <li><pre>${data.parameters}</pre></li>
                      <li><b>Exception: </b></li>
                      <li><pre>${data.exception}</pre></li>
                      <li><b>Process Output: </b></li>
                      <li><pre>${data.processOutput}</pre></li>
                    </ul><hr />`
      );

      logger.info(`Sending admin multi results email`);

      const adminEmailResults = await mailer.sendMail({
        from: config.email.admin,
        to: config.email.support,
        subject: `ezQTL Results - ${timestamp} EST`,
        html: await readTemplate(
          __dirname + '/templates/admin-multi-failure.html',
          { errors: errorsTemplate.join(''), request: data.request }
        ),
      });
    }

    return true;
  } catch (err) {
    logger.error(err);
    const { params, request } = data;

    // logger.error(err);

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
      from: config.email.admin,
      to: config.email.support,
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
        from: config.email.admin,
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
      const requestData = JSON.parse(message.Body);

      logger.info(`Received Message ${requestData.request}`);
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

      const status = requestData.multi
        ? await processMultiLoci(requestData)
        : await processSingleLocus(requestData);
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
