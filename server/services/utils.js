import { fileURLToPath } from 'url';
import { existsSync, createReadStream } from 'fs';
import {
  mkdir,
  writeFile,
  readFile,
  copyFile,
  readdir,
  rm,
} from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import template from 'lodash/template.js';
import { pickBy } from 'lodash-es';
import Papa from 'papaparse';
import AdmZip from 'adm-zip';

// promisified executeFile
export const execFileAsync = promisify(execFile);

/**
 * Checks if the current module is the main module.
 * @param {ImportMeta} importMeta
 * @param {NodeJS.ProcessEnv} env
 * @returns
 */
export function isMainModule(importMeta, env = process.env) {
  const mainModulePath = env.pm_exec_path || process.argv[1];
  const currentModulePath = fileURLToPath(importMeta.url);
  return mainModulePath === currentModulePath;
}

/**
 * Creates directories if they don't exist.
 * @param {string[]} dirs
 * @returns
 */
export async function mkdirs(dirs) {
  return await Promise.all(dirs.map((dir) => mkdir(dir, { recursive: true })));
}

/**
 * Removes directories
 * @param {string[]} dirs
 * @returns
 */
export async function rmdirs(dirs) {
  return await Promise.all(dirs.map((dir) => rm(dir, { recursive: true })));
}

/**
 * Writes json to a file.
 * @param {string} filepath
 * @param {any} data
 * @returns {Promise<void>} fulfilled when the file is written
 */
export async function writeJson(filepath, data) {
  return await writeFile(filepath, JSON.stringify(data), 'utf-8');
}

/**
 * Reads json from a file.
 * @param {string} filepath
 * @returns {any} data
 */
export async function readJson(filepath) {
  try {
    const data = await readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export async function renderTemplate(filepath, data) {
  const templateContents = await readFile(filepath, 'utf8');
  return template(templateContents)(data);
}

/**
 * Selects the first file which exists from the given list of files.
 * @param {string[]} filePaths
 * @returns string
 */
export function coalesceFilePaths(filePaths) {
  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}

/**
 * Removes the file extension from the given file path.
 * @param {string} filePath
 * @returns {string} The file path without the extension.
 */
export function stripExtension(filePath) {
  if (!filePath) return null;
  const { dir, name } = path.parse(filePath);
  return path.join(dir, name);
}

/**
 * Copies files from the given source directory to the given destination directory.
 * @param {string} source Source directory path
 * @param {string} destination Destination directory path
 * @param {boolean} overwrite Overwrite existing files
 */
export async function copyFiles(source, destination, overwrite = false) {
  const sourceFiles = await readdir(source, { withFileTypes: true });
  for (const file of sourceFiles.filter((f) => f.isFile())) {
    const sourceFilePath = path.resolve(source, file.name);
    const destinationFilePath = path.resolve(destination, file.name);
    if (overwrite || !existsSync(destinationFilePath)) {
      await copyFile(sourceFilePath, destinationFilePath);
    }
  }
}

export function pickNonNullValues(object) {
  return pickBy(object, (v) => v !== null);
}

//
/**
 * async generator for retrieving paths for all files under a given directory
 * @param {string} filePath
 * @returns {AsyncGenerator} async generator to consume
 * consume the generator like so:
 * for await (const f of getFiles(filePath)) {
    if (f) ...
  }
 */
export async function* getFiles(filePath) {
  const dirents = await readdir(filePath, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(filePath, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export function parseCSV(filepath) {
  const file = createReadStream(filepath);
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete(results, file) {
        resolve(results.data);
      },
      error(err, file) {
        reject(err);
      },
    });
  });
}

/**
 * Normalizes an ExcelJS cell value to a primitive, matching the output of
 * xlsx's sheet_to_json (which returns raw numbers/strings/dates).
 *
 * Any object shape that cannot be reduced to a primitive resolves to
 * `undefined` so that a raw ExcelJS object is never leaked into an API
 * response (xlsx only ever emitted scalars).
 * @param {*} value
 */
function normalizeCellValue(value) {
  if (value === null || value === undefined) return undefined;
  if (value instanceof Date) return value;
  if (typeof value !== 'object') return value;

  // formula cells expose { formula|sharedFormula, result }, but the cached
  // result is absent when the file was written by a non-Excel producer
  if ('result' in value) return normalizeCellValue(value.result);
  if ('richText' in value)
    return value.richText.map(({ text }) => text).join('');
  if ('text' in value) return normalizeCellValue(value.text);
  return undefined;
}

/**
 * Converts an ExcelJS worksheet to an array of row objects, replicating the
 * behavior of `XLSX.utils.sheet_to_json`: the first row of the sheet's used
 * range supplies the keys, blank cells are omitted, and blank rows are skipped.
 *
 * Header naming follows the same algorithm as xlsx, so no column is silently
 * dropped or overwritten: a blank header becomes `__EMPTY`, and any name that
 * is already taken gets the next free `_1`/`_2`/... suffix.
 *
 * Note: date cells resolve to `Date` objects (serialized as ISO strings) rather
 * than the raw Excel serial numbers xlsx returned by default.
 * @param {import('exceljs').Worksheet} worksheet
 * @returns {object[]}
 */
export function sheetToJson(worksheet) {
  // xlsx reads from the sheet's used range, so leading blank rows and columns
  // are ignored; exceljs exposes neither bound directly, so derive them.
  let headerRowNumber;
  const dataRowNumbers = [];
  let firstColumn = Infinity;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    let rowFirstColumn = Infinity;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (normalizeCellValue(cell.value) !== undefined)
        rowFirstColumn = Math.min(rowFirstColumn, colNumber);
    });
    if (rowFirstColumn === Infinity) return;

    firstColumn = Math.min(firstColumn, rowFirstColumn);
    if (headerRowNumber === undefined) headerRowNumber = rowNumber;
    else dataRowNumbers.push(rowNumber);
  });

  if (headerRowNumber === undefined) return [];

  const headerRow = worksheet.getRow(headerRowNumber);
  const headers = [];
  const taken = new Set();

  for (let colNumber = firstColumn; colNumber <= worksheet.columnCount; colNumber++) {
    const value = normalizeCellValue(headerRow.getCell(colNumber).value);
    const name =
      value === undefined || value === '' ? '__EMPTY' : String(value);

    let candidate = name;
    let counter = 1;
    while (taken.has(candidate)) candidate = `${name}_${counter++}`;

    taken.add(candidate);
    headers[colNumber] = candidate;
  }

  return dataRowNumbers.map((rowNumber) => {
    const record = {};
    worksheet.getRow(rowNumber).eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (header === undefined) return;
      const value = normalizeCellValue(cell.value);
      if (value !== undefined && value !== '') record[header] = value;
    });
    return record;
  }).filter((record) => Object.keys(record).length > 0);
}

/**
 * Extracts a zip archive to a target folder, replacing the unmaintained
 * `decompress` package. Leading path segments can be removed via `strip`
 * (equivalent to decompress's `strip` option).
 *
 * Entries that would resolve outside of `outputFolder` are rejected to guard
 * against path traversal ("zip slip").
 *
 * @param {string} archivePath path to the .zip archive
 * @param {string} outputFolder destination folder
 * @param {{strip?: number}} [options]
 */
export async function extractZip(archivePath, outputFolder, { strip = 0 } = {}) {
  const zip = new AdmZip(archivePath);
  const destination = path.resolve(outputFolder);

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const relativePath = entry.entryName.split('/').slice(strip).join('/');
    if (!relativePath) continue;

    const targetPath = path.resolve(destination, relativePath);
    if (
      targetPath !== destination &&
      !targetPath.startsWith(destination + path.sep)
    ) {
      throw new Error(`Refusing to extract entry outside of target directory: ${entry.entryName}`);
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, entry.getData());
  }
}
