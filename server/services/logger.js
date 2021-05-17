const { info } = require('console');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { folder: logFolder, level: logLevel } = require('../config.json').logs;
require('winston-daily-rotate-file');
const { Console, DailyRotateFile } = transports;

module.exports = new createLogger({
  level: logLevel || 'info',
  format: format.combine(
    format.errors({ stack: true }), // <-- use errors format
    format.colorize(),
    format.timestamp(),
    format.prettyPrint(),
    format.label({ label: '[ezQTL]' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // The simple format outputs
    // `${level}: ${message} ${[Object with everything else]}`
    //
    // format.simple(),
    //
    // Alternatively you could use this custom printf format if you
    // want to control where the timestamp comes in your final message.
    // Try replacing `format.simple()` above with this:
    //
    format.printf((info) => {
      if (info.level === 'error') {
        return `[${info.timestamp}] [${info.level}] ${info.stack}`;
      } else {
        return `[${info.timestamp}] [${info.level}] ${info.message}`;
      }
    })
  ),
  transports: [
    new Console(),
    new DailyRotateFile({
      filename: path.resolve(logFolder, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: false,
      maxSize: '1024m',
      timestamp: true,
      maxFiles: '1d',
      prepend: true,
    }),
  ],
  exitOnError: false,
});
