import { createWriteStream, unlink } from "fs";
import { mkdir } from "fs/promises";
import path from "path";

/**
 * Custom DiskStorage class for multer which supports:
 *  - promise-based filename/destination functions
 *  - appending to existing files (ie: chunked uploads)
 */
export default class DiskStorage {
  constructor({ filename, destination }) {
    this.getFilename = filename;
    this.getDestination = destination;
  }

  async _handleFile(req, file, cb) {
    try {
      const destination = await this.getDestination(req, file);
      const filename = await this.getFilename(req, file);
      await mkdir(destination, { recursive: true });

      const finalPath = path.join(destination, filename);
      const outStream = createWriteStream(finalPath, { flags: "a" });

      file.stream.pipe(outStream);
      outStream.on("error", cb);
      outStream.on("finish", () => {
        cb(null, {
          destination: destination,
          filename: filename,
          path: finalPath,
          size: outStream.bytesWritten,
        });
      });
    } catch (error) {
      cb(error);
    }
  }

  _removeFile(req, file, cb) {
    var path = file.path;

    delete file.destination;
    delete file.filename;
    delete file.path;

    unlink(path, cb);
  }
}
