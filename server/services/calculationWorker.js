import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { mkdirs, readJson, writeJson, rmdirs } from './utils.js';
import { sendNotification } from './notifications.js';
import {
  calculateQC,
  calculateMain,
  calculateLocusLD,
  calculateECAVIAR,
  calculateHyprcoloc,
  calculateColocVisualize,
} from './calculate.js';

function mergeState(state, data) {
  return _.mergeWith(state, data, (obj, src) => {
    if (_.isArray(obj)) {
      return src;
    }
  });
}

// get summary file
function getSummary(requestId, env) {
  const logPath = path.resolve(env.OUTPUT_FOLDER, requestId, 'ezQTL.log');
  if (fs.existsSync(logPath)) {
    return String(fs.readFileSync(logPath));
  } else {
    return '';
  }
}

/**
 * Runs all possible calculations, returning job state for redux hydration
 * @param {*} params
 * @param {*} logger
 * @param {*} env
 * @returns
 */
async function calculate(params, logger, env) {
  const { request } = params;
  // qtlsCalculateQC
  const { error } = await calculateQC(params, logger);
  if (error) {
    logger.error('calculateQC error');
    throw error;
  }

  let summary = getSummary(request, env);
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
    genotypeFile: params.genotypeFile,
    quantificationFile: params.quantificationFile,
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
    main = JSON.parse(await calculateMain(params));
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
            request,
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
          request,
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
        const colocSummary = await calculateColocVisualize(
          {
            request,
            hydata: state.hyprcoloc_table.data,
            ecdata: state.ecaviar_table.data,
            LDFile: state.inputs['ld_file'][0],
            associationFile: state.inputs['association_file'][0],
            gwasFile: state.inputs['gwas_file'][0],
            select_dist: state.inputs['select_dist'][0] * 1000,
            select_ref: state.locus_alignment['top']['rsnum'],
            calcEcaviar: state.ecaviar_table.data.length === 0,
          },
          logger,
          env
        );

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
        request,
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

function userErrorMessage(msg) {
  return msg.toString().includes('ezQTL QC failed')
    ? msg.toString()
    : msg.toString().includes('VROOM')
    ? 'An error occurred while trying to read a large data file. Please try again with a smaller cis-QTL Distance value.'
    : 'An error occurred in QC calculation. Please review your input parameters and calculation logs.';
}

/**
 * Processes a message and sends emails when finished
 * @param {object} params
 */
async function processSingleLocus(data, logger, env) {
  const { request, params } = data;
  const inputFolder = path.resolve(env.INPUT_FOLDER, request);
  const outputFolder = path.resolve(env.OUTPUT_FOLDER, request);
  const paramsFilePath = path.resolve(inputFolder, 'params.json');
  const statusFilePath = path.resolve(outputFolder, 'status.json');
  const stateFilePath = path.resolve(outputFolder, 'state.json');

  const submittedAt = new Date((await readJson(statusFilePath)).submittedAt);
  const start = new Date().getTime();

  try {
    logger.info(`[${request}] Start calculation`);
    const { state, main } = await calculate(params, logger, env);
    const end = new Date().getTime();
    logger.info(`[${request}] Calculation done`);

    const status = {
      id: request,
      status: 'COMPLETED',
    };
    await writeJson(stateFilePath, { state, main });
    await writeJson(statusFilePath, status);

    // send user success email
    logger.info(`[${request}] Sending user success email`);
    await sendNotification(
      params.email,
      `ezQTL - ${params.jobName} - ${submittedAt.toISOString()} EST`,
      'templates/user-success-email.html',
      {
        originalTimestamp: submittedAt.toISOString(),
        execTime: getExecutionTime(start, end),
        resultsUrl: `${env.APP_BASE_URL}/#/qtls/${request}`,
        supportEmail: env.EMAIL_ADMIN,
        jobName: params.jobName,
      }
    );

    return true;
  } catch (error) {
    const end = new Date().getTime();
    logger.error(
      `[${request}] An error occurred while processing single locus job`
    );
    logger.error(error);
    logger.error(JSON.stringify(params));
    const execTime = getExecutionTime(start, end);
    logger.info(`[${request}] Execution time: ${execTime}`);
    const status = {
      id: request,
      status: 'FAILED',
    };
    const stdout = error.stdout ? error.stdout.toString() : '';
    const stderr = error.stderr ? error.stderr.toString() : '';
    const summaryLog = getSummary(request, env).replaceAll('\n', '<br>');

    // template variables
    const templateData = {
      request: request,
      parameters: JSON.stringify(params, null, 4),
      jobName: params.jobName,
      originalTimestamp: submittedAt.toISOString(),
      execTime: execTime,
      exception: error.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: env.EMAIL_ADMIN,
      userError: userErrorMessage(error),
      error,
      summaryLog,
    };

    // send admin error email for unexpected errors not prefixed with "ezQTL QC failed"
    if (!error.toString().includes('ezQTL QC failed')) {
      logger.info(`[${request}] Sending admin error email`);
      await sendNotification(
        env.EMAIL_TECH_SUPPORT,
        `ezQTL Error: ${request} - ${submittedAt.toISOString()} EST`,
        'templates/admin-failure-email.html',
        templateData
      );
    }

    // send user error email
    if (params.email) {
      logger.info(`[${request}] Sending user error email`);
      await sendNotification(
        params.email,
        `ezQTL Error: ${params.jobName} - ${submittedAt.toISOString()} EST`,
        'templates/user-failure-email.html',
        templateData
      );
    }

    return false;
  } finally {
    // delete input data from s3
    try {
      logger.debug(`[${request}] Deleting input data`);
      await rmdirs([path.resolve(env.INPUT_FOLDER, request)]);
    } catch (error) {
      logger.error(`[${request}] An error occurred while deleting input data`);
      logger.error(error);
    }
  }
}

async function processMultiLoci(data, logger, env) {
  const { params: paramsArr, request: mainRequest } = data;
  const { email } = paramsArr[0];
  const mainStart = new Date().getTime();

  const submittedAt = new Date(
    (
      await readJson(
        path.resolve(env.OUTPUT_FOLDER, mainRequest, 'status.json')
      )
    ).submittedAt
  );

  try {
    async function processJob(params) {
      const { request, jobName } = params;
      const outputFolder = path.resolve(env.OUTPUT_FOLDER, request);
      const statusFilePath = path.resolve(outputFolder, 'status.json');
      const stateFilePath = path.resolve(outputFolder, 'state.json');

      const start = new Date().getTime();
      try {
        await mkdirs([outputFolder]);
        logger.info(`[${mainRequest}] Start multi calculation`);
        const { state, main } = await calculate(params, logger, env);
        const end = new Date().getTime();
        logger.info(`[${mainRequest}] Multi calculation done (${request})`);

        const status = {
          id: request,
          status: 'COMPLETED',
        };
        await writeJson(stateFilePath, { state, main });
        await writeJson(statusFilePath, status);

        return { jobName, request, execTime: getExecutionTime(start, end) };
      } catch (error) {
        const end = new Date().getTime();
        logger.error(
          `[${mainRequest}] An error occurred while processing multi locus job (${params.request})`
        );
        logger.error(error);
        logger.error(JSON.stringify(params));
        const stdout = error.stdout ? error.stdout.toString() : '';
        const stderr = error.stderr ? error.stderr.toString() : '';
        const summaryLog = getSummary(request, env).replaceAll('\n', '<br>');

        return {
          jobName,
          request,
          error,
          parameters: JSON.stringify(params, null, 4),
          processOutput: !stdout && !stderr ? null : stdout + stderr,
          execTime: getExecutionTime(start, end),
          summaryLog,
        };
      }
    }

    // utility for applying async function against array
    const mapSeries = async (iterable, fn) => {
      const results = [];
      for (const x of iterable) {
        results.push(await fn(x));
      }
      return results;
    };
    const calculations = await mapSeries(paramsArr, processJob);
    const template = calculations.map((data, i) => {
      if (data.error) {
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Error: An error occurred while processing this job</li>
                  <li><pre>${userErrorMessage(data.error)}</pre></li>
                  <li><b>Logs: </b></li>
                  <li><pre>${data.summaryLog}</pre></li>
                  <li>Execution Time: ${data.execTime}</li>
                </ul>
                </br>`;
      } else {
        const resultsUrl = `${env.APP_BASE_URL}/#/qtls/${data.request}`;
        return `<ul style="list-style-type: none">
                  <li>Job Name: ${data.jobName}</li>
                  <li>Execution Time: ${data.execTime}</li>
                  <li>Results: <a href="${resultsUrl}">${resultsUrl}</a></li><br />
                </ul>
                </br>`;
      }
    });

    // specify email template variables
    const templateData = {
      results: template.join(''),
      supportEmail: env.EMAIL_ADMIN,
    };

    // send user success email
    logger.info(`[${mainRequest}] Sending user multi locus results email`);
    await sendNotification(
      email,
      `ezQTL - ${paramsArr[0].jobName} - ${submittedAt.toISOString()} EST`,
      'templates/user-multi-email.html',
      templateData
    );

    // send admin failure email if needed
    const failed = calculations.filter(
      (data) =>
        data?.error && !data?.error.toString().includes('ezQTL QC failed')
    );
    if (failed.length) {
      const errorsTemplate = failed.map(
        (data) => `<ul style="list-style-type: none">
                      <li><b>Request: </b>${data.request}</li>
                      <li><b>Job Name: </b>${data.jobName}</li>
                      <li><b>Parameters: </b></li>
                      <li><pre>${data.parameters}</pre></li>
                      <li><b>Exception: </b></li>
                      <li><pre>${data.error.toString()}</pre></li>
                      <li><b>Process Output: </b></li>
                      <li><pre>${data.processOutput}</pre></li>
                    </ul><hr />`
      );

      logger.info(`[${mainRequest}] Sending admin multi locus error email`);
      await sendNotification(
        env.EMAIL_TECH_SUPPORT,
        `ezQTL Error: ${data.request} - ${submittedAt.toISOString()} EST`,
        'templates/admin-multi-failure-email.html',
        { errors: errorsTemplate.join(''), request: data.request }
      );
    }

    return true;
  } catch (err) {
    const end = new Date().getTime();
    logger.error(
      `[${mainRequest}] An error occurred while processing multi-loci job`
    );
    logger.error(err);
    logger.error(JSON.stringify(data));
    const execTime = getExecutionTime(mainStart, end);
    logger.info(`[${mainRequest}] Execution time: ${execTime}`);
    const { params, request } = data;

    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';

    // template variables
    const templateData = {
      request,
      parameters: JSON.stringify(params, null, 4),
      jobName: params.jobName,
      originalTimestamp: submittedAt.toISOString(),
      execTime: execTime,
      exception: err.toString(),
      processOutput: !stdout && !stderr ? null : stdout + stderr,
      supportEmail: env.EMAIL_ADMIN,
      summaryLog: '',
      userError: userErrorMessage(err),
    };

    // send admin error email
    logger.info(`[${mainRequest}] Sending admin error email`);
    await sendNotification(
      env.EMAIL_TECH_SUPPORT,
      `ezQTL Error: ${request} - ${submittedAt.toISOString()} EST`,
      'templates/admin-failure-email.html',
      templateData
    );

    // send user error email
    if (email) {
      logger.info(`[${mainRequest}] Sending user error email`);
      await sendNotification(
        email,
        `ezQTL Error: ${
          paramsArr[0].jobName
        } - ${submittedAt.toISOString()} EST`,
        'templates/user-failure-email.html',
        templateData
      );
    }

    return false;
  } finally {
    // delete input data from s3
    try {
      logger.debug(`[${mainRequest}] Deleting input data`);
      await rmdirs([path.resolve(env.INPUT_FOLDER, mainRequest)]);
    } catch (error) {
      logger.error(
        `[${mainRequest}] An error occurred while deleting input data`
      );
      logger.error(error);
    }
  }
}

export async function runCalculation(params, logger, env) {
  if (params.multi) {
    return await processMultiLoci(params, logger, env);
  } else {
    return await processSingleLocus(params, logger, env);
  }
}

function getExecutionTime(start, end) {
  const time = end - start;
  const minutes = Math.floor(time / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(0);

  return (minutes > 0 ? minutes + ' minutes ' : '') + seconds + ' seconds';
}
