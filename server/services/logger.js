const { info } = require('console');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { folder: logFolder, level: logLevel } = require('../config.json').logs;
require('winston-daily-rotate-file');
const { Console, DailyRotateFile } = transports;

module.exports = new createLogger({
  level: logLevel || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `[${info.timestamp}] [${info.level}] ${info.stack || 
      (typeof info.message === 'string' ? info.message : JSON.stringify(info.message))
    }`)
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
      prepend: true
    }),
  ],
  exitOnError: false
});