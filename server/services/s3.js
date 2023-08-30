import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { createWriteStream, createReadStream, statSync } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import consumers from 'stream/consumers';
import { mkdirs } from './utils.js';

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

export async function getObjectBuffer(
  key,
  bucket,
  config = { region: 'us-east-1' }
) {
  const s3 = new S3Client(config);
  const params = { Bucket: bucket, Key: key.replace(/^(\.\.(\/|\\|$))+/, '') };
  const { Body } = await s3.send(new GetObjectCommand(params));
  return await consumers.buffer(Body);
}

export async function downloadObject(
  destination,
  key,
  bucket,
  config = { region: 'us-east-1' }
) {
  const s3 = new S3Client(config);
  const params = { Bucket: bucket, Key: key };
  const { Body } = await s3.send(new GetObjectCommand(params));
  return writeStream(destination, Body);
}

export function uploadObject(
  file,
  key,
  bucket,
  config = { region: 'us-east-1' }
) {
  const s3 = new S3Client(config);
  const params = {
    Bucket: bucket,
    Key: key,
    Body: createReadStream(file),
  };
  return s3.send(new PutObjectCommand(params));
}

export function listObjects(prefix, bucket, config = { region: 'us-east-1' }) {
  const s3 = new S3Client(config);
  return s3.send(new ListObjectsCommand({ Prefix: prefix, Bucket: bucket }));
}

function writeStream(destination, stream) {
  return new Promise(async (resolve, reject) => {
    const directory = path.dirname(destination);
    await mkdirs([directory]);
    const writer = createWriteStream(destination);
    writer.on('finish', () => resolve(destination));
    writer.on('error', reject);
    stream.pipe(writer);
  });
}

export function downloadDirectory(destination, key, bucket, config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Contents: files } = await listObjects(key, bucket, config);
      if (!files)
        reject(
          new Error(`${path.join(bucket, key)} is empty or does not exist`)
        );
      const response = await Promise.all(
        files.map((e) => {
          return downloadObject(
            path.join(destination, e.Key.replace(key, '')),
            e.Key,
            bucket,
            config
          );
        })
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export function uploadDirectory(directory, key, bucket, config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const files = await getFiles(directory);
      if (!files) reject(new Error(`${directory} is empty or does not exist`));

      const response = await Promise.all(
        files.map((file) => {
          const relativePath = file.replace(directory, '');
          // if (statSync(file).isFile()) {
          return uploadObject(
            file,
            path.join(key, relativePath),
            bucket,
            config
          );
          // }
        })
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}
