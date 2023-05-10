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

    logger.debug(`[${request}] Downloading: ${Key} to ${savePath}`);
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
          fs.unlink(filepath, (error) => {
            if (error) {
              logger.error('An error occurred while removing the archive');
              logger.error(error);
            }
          })
        );
    }
  }
}

// get summary file
function getSummary(requestId) {
  const logPath = path.resolve(workingDirectory, 'tmp', requestId, 'ezQTL.log');
  if (fs.existsSync(logPath)) {
    return String(fs.readFileSync(logPath));
  } else {
    return '';
  }
}

async function calculate(params) {
  const { request } = params;

  // qtlsCalculateQC
  const { error } = await calculateQC({
    workingDirectory: workingDirectory,
    bucket: config.aws.s3.data,
    ...params,
  });
  if (error) throw error;

  let summary = getSummary(request);
  summary = summary.replace(/#/g, '\u2022');
  summary = summary.split('\n\n');

  let newParams = { ...params };

  if (
    (params.associationFile || params.qtlKey) &&
    !summary.find((log) => log.includes('QTL file detected as empty file'))
  ) {
    params.associationFile = 'ezQTL_input_qtl.txt';
  }
  if (
    (params.LDFile || params.ldPublic) &&
    !summary.find((log) => log.includes('LD file detected as empty file'))
  ) {
    params.LDFile = 'ezQTL_input_ld.gz';
  }
  if (
    (params.gwasFile || params.gwasKey) &&
    !summary.find((log) => log.includes('GWAS file detected as empty file'))
  ) {
    params.gwasFile = 'ezQTL_input_gwas.txt';
  }

  let state = {
    ...newParams,
    locus_qc: summary,
    gwasFile: params.gwasFile,
    associationFile: params.associationFile,
    LDFile: params.LDFile,
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
      logger.error(`[${request}] calculateHyprcoloc`);
      logger.error(err);
    }

    // qtlsGWAS ECaviarCalculation
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
          select_ref: state.locus_alignment.top.rsnum,
        })
      );

      state = mergeState(state, {
        ecaviar_table: {
          data: ecaviar['data'][0],
        },
      });
    } catch (err) {
      logger.error(`[${request}] calculateECAVIAR`);
      logger.error(err);
    }
    // qtlsColocVisualization - summary
    try {
      if (
        state?.hyprcoloc_table.data &&
        state?.hyprcoloc_table.data.length > 0 &&
        state?.ecaviar_table.data &&
        state?.ecaviar_table.data.length > 0
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
          select_ref: state.locus_alignment['top']['rsnum'],
          calcEcaviar: state.ecaviar_table.data.length === 0,
        });

        state = mergeState(state, {
          summaryLoaded: true,
        });
      }
    } catch (err) {
      logger.error(`[${request}] calculateColocVisualize`);
      logger.error(err);
    }
  }

  // qtlsGWASLocusLDCalculation
  try {
    if (params.LDFile) {
      const locusLD = await calculateLocusLD({
        workingDirectory: workingDirectory,
        bucket: config.aws.s3.data,
        request: request,
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
    logger.error(`[${request}] calculateLocusLD`);
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
  const mailer = nodemailer.createTransport(config.email.smtp);
  // logger.debug(params);
  const start = new Date().getTime();

  try {
    const s3 = new AWS.S3();
    // Setup folders
    const directory = path.resolve(config.tmp.folder, request);
    await fs.promises.mkdir(directory, { recursive: true });

    await downloadS3(request, directory);
    logger.info(`[${request}] Start calculation`);
    const { state, main } = await calculate(params);
    const end = new Date().getTime();
    logger.info(`[${request}] Calculation done`);

    // upload parameters
    logger.debug(`[${request}] Uploading parameters`);
    await s3
      .upload({
        Body: JSON.stringify({ state: state, main: main }),
        Bucket: config.aws.s3.queue,
        Key: `${config.aws.s3.outputPrefix}/${request}/state.json`,
      })
      .promise();

    // upload archived project directory
    logger.debug(`[${request}] Uploading results`);
    await s3
      .upload({
        Body: tar.c({ gzip: true, C: config.tmp.folder }, [request]),
        Bucket: config.aws.s3.queue,
        Key: `${config.aws.s3.outputPrefix}/${request}/${request}.tgz`,
      })
      .promise();

    // specify email template variables
    const templateData = {
      originalTimestamp: timestamp,
      execTime: getExecutionTime(start, end),
      resultsUrl: `${config.email.baseUrl}/#/qtls/${request}`,
      supportEmail: config.email.adminSupport,
      jobName: params.jobName,
    };

    // send user success email
    logger.info(`[${request}] Sending user success email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.adminSupport,
      to: params.email,
      subject: `ezQTL Results - ${timestamp} EST`,
      html: await readTemplate(
        __dirname + '/templates/user-success-email.html',
        templateData
      ),
    });

    return true;
  } catch (error) {
    const end = new Date().getTime();
    logger.error(
      `[${request}] An error occurred while processing single locus job`
    );
    logger.error(error);
    const execTime = getExecutionTime(start, end);
    logger.info(`[${request}] Execution time: ${execTime}`);

    const stdout = error.stdout ? error.stdout.toString() : '';
    const stderr = error.stderr ? error.stderr.toString() : '';
    const summaryLog = getSummary(request).replaceAll('\n', '<br>');

    // template variables
    const templateData = {
      request: request,
      parameters: JSON.stringify(params, null, 4),
      jobName: params.jobName,
      originalTimestamp: timestamp,
      execTime: execTime,
      exception: error.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: config.email.adminSupport,
      userError: error.toString().includes('ezQTL QC failed')
        ? error.toString()
        : error.toString().includes('VROOM')
        ? 'An error occurred while trying to read a large data file. Please try again with a smaller cis-QTL Distance value.'
        : 'An error occurred in QC calculation. Please review your input parameters and calculation logs.',
      error,
      summaryLog,
    };

    // send admin error email
    logger.info(`[${request}] Sending admin error email`);
    const adminEmailResults = await mailer.sendMail({
      from: config.email.adminSupport,
      to: config.email.techSupport,
      subject: `ezQTL Error: ${request} - ${timestamp} EST`, // searchable calculation error subject
      html: await readTemplate(
        __dirname + '/templates/admin-failure-email.html',
        templateData
      ),
    });

    // send user error email
    if (params.email) {
      logger.info(`[${request}] Sending user error email`);
      const userEmailResults = await mailer.sendMail({
        from: config.email.adminSupport,
        to: params.email,
        subject: `ezQTL Error: ${params.jobName} - ${timestamp} EST`,
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
  const mailer = nodemailer.createTransport(config.email.smtp);
  // logger.debug(params);
  const s3 = new AWS.S3();

  try {
    const calculations = await Promise.all(
      paramsArr.map(async (params, i) => {
        const start = new Date().getTime();
        try {
          const { request, jobName } = params;

          const directory = path.resolve(config.tmp.folder, request);
          await fs.promises.mkdir(directory, { recursive: true });

          // download user uploaded files into unique
          await downloadS3(mainRequest, directory);
          logger.info(
            `[${mainRequest}] Start Calculation of multi locus job (${request})`
          );
          const { state, main } = await calculate(params);
          const end = new Date().getTime();
          logger.info(
            `[${mainRequest}] Calculation of multi locus job done (${request})`
          );

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
            execTime: getExecutionTime(start, end),
            request: request,
          });
        } catch (error) {
          const end = new Date().getTime();
          logger.error(
            `[${mainRequest}] An error occurred while processing multi locus job (${params.request})`
          );
          logger.error(error);
          const stdout = error.stdout ? error.stdout.toString() : '';
          const stderr = error.stderr ? error.stderr.toString() : '';

          return Promise.resolve({
            request: params.request,
            jobName: params.jobName,
            parameters: JSON.stringify(params, null, 4),
            exception: error.toString(),
            processOutput: !stdout && !stderr ? null : stdout + stderr,
            execTime: getExecutionTime(start, end),
          });
        }
      })
    );

    const template = calculations.map((data, i) => {
      if (data.exception) {
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Error - Failed to Process Job</li>
                  <li>Execution Time: ${data.execTime}</li>
                </ul>`;
      } else {
        const resultsUrl = `${config.email.baseUrl}/#/qtls/${data.request}`;
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Execution Time: ${data.execTime}</li>
                  <li>Results: <a href="${resultsUrl}">${resultsUrl}</a></li><br />
                </ul>`;
      }
    });

    // specify email template variables
    const templateData = {
      results: template.join(''),
      supportEmail: config.email.adminSupport,
    };

    // send user success email
    logger.info(`[${mainRequest}] Sending user multi locus results email`);
    const userEmailResults = await mailer.sendMail({
      from: config.email.adminSupport,
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

      logger.info(`[${mainRequest}] Sending admin multi locus error email`);
      const adminEmailResults = await mailer.sendMail({
        from: config.email.adminSupport,
        to: config.email.techSupport,
        subject: `ezQTL Results - ${timestamp} EST`,
        html: await readTemplate(
          __dirname + '/templates/admin-multi-failure.html',
          { errors: errorsTemplate.join(''), request: data.request }
        ),
      });
    }

    return true;
  } catch (err) {
    logger.error(
      `[${mainRequest}] An error occurred while processing multi-loci job`
    );
    logger.error(err);
    const execTime = getExecutionTime(start, end);
    logger.info(`[${mainRequest}] Execution time: ${execTime}`);
    const { params, request } = data;

    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';

    // template variables
    const templateData = {
      request: request,
      parameters: JSON.stringify(params, null, 4),
      jobName: params.jobName,
      originalTimestamp: timestamp,
      execTime: execTime,
      exception: err.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: config.email.adminSupport,
    };

    // send admin error email
    logger.info(`[${mainRequest}] Sending admin error email`);
    const adminEmailResults = await mailer.sendMail({
      from: config.email.adminSupport,
      to: config.email.techSupport,
      subject: `ezQTL Error: ${request} - ${timestamp} EST`, // searchable calculation error subject
      html: await readTemplate(
        __dirname + '/templates/admin-failure-email.html',
        templateData
      ),
    });

    // send user error email
    if (params.email) {
      logger.info(`[${mainRequest}] Sending user error email`);
      const userEmailResults = await mailer.sendMail({
        from: config.email.adminSupport,
        to: params.email,
        subject: `ezQTL Error: ${params.jobName} - ${timestamp} EST`,
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
  try {
    const sqs = new AWS.SQS();
    // to simplify running multiple workers in parallel,
    // fetch one message at a time
    const { QueueUrl } = await sqs
      .getQueueUrl({ QueueName: config.aws.sqs.url })
      .promise();

    // logger.debug('Polling for messages');
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

      logger.info(`[${requestData.request}] Received message`);
      // logger.debug(message.Body);

      // while processing is not complete, update the message's visibilityTimeout every 20 seconds
      const refreshVisibilityTimeout = setInterval(async (_) => {
        try {
          logger.debug(
            `[${requestData.request}] Refreshing visibility timeout`
          );
          await sqs
            .changeMessageVisibility({
              QueueUrl: QueueUrl,
              ReceiptHandle: message.ReceiptHandle,
              VisibilityTimeout: config?.aws.sqs.visibilityTimeout || 300,
            })
            .promise();
        } catch (error) {
          logger.error(
            `[${requestData.request}] Unable to refresh visibility timeout`
          );
          logger.error(error);
          throw error;
        }
      }, 1000 * 20);
      // log every 60 minutes to indicate job progress for long running jobs
      const heartbeat = setInterval((_) => {
        logger.info(`[${requestData.request}] In Progress`);
      }, 1000 * 60 * 60);

      // processSingleLocus should return a boolean status indicating success or failure
      const status = requestData.multi
        ? await processMultiLoci(requestData)
        : await processSingleLocus(requestData);

      clearInterval(refreshVisibilityTimeout);
      clearInterval(heartbeat);

      // remove original message from queue once processed
      try {
        logger.info(`[${requestData.request}] Deleting message`);
        await sqs
          .deleteMessage({
            QueueUrl: QueueUrl,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();
      } catch (error) {
        logger.error(`[${requestData.request}] Unable to delete message`);
        throw error;
      }
    }
  } catch (e) {
    // catch exceptions related to sqs
    logger.error('An error occurred while receiving or processing messages.');
    logger.error(e);
    // if message was not processed successfully, send it to the
    // error queue (add metadata in future if needed)
    // if (config.aws.sqs.errorUrl) {
    //   const { QueueUrl } = await sqs
    //     .getQueueUrl({ QueueName: config.aws.sqs.errorUrl })
    //     .promise();
    //   await sqs
    //     .sendMessage({
    //       QueueUrl,
    //       MessageDeduplicationId: request,
    //       MessageGroupId: request,
    //       MessageBody: JSON.stringify(params),
    //     })
    //     .promise();
    // }
  } finally {
    // schedule receiving next message
    setTimeout(receiveMessage, 1000 * (config.aws.sqs.pollInterval || 60));
  }
}

function getExecutionTime(start, end) {
  const time = end - start;
  const minutes = Math.floor(time / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(0);

  return (minutes > 0 ? minutes + ' min ' : '') + seconds + ' secs';
}
