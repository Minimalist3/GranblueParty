const winston = require('winston');
const { format } = require('logform');

import path from 'path'
import config from './config';

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.metadata(),
    format.timestamp(),
    format.align(),
    format.printf(info => {
      let err = `${info.timestamp} ${info.level}: ${info.message}`;

      if (info.metadata.hasOwnProperty('e') && info.metadata.e !== undefined) {
        err += `\n\t${info.metadata.e}`;
      }

      if (info.metadata.hasOwnProperty('req') && info.metadata.req !== undefined) {
        if (info.metadata.req.hasOwnProperty('originalUrl')) {
          err += "\n\tRoute: " + JSON.stringify(info.metadata.req.originalUrl);
        }
        if (info.metadata.req.hasOwnProperty('params')) {
          err += "\n\tParams: " + JSON.stringify(info.metadata.req.params);
        }
        if (info.metadata.req.hasOwnProperty('body')) {
          err += "\n\tBody: " + JSON.stringify(info.metadata.req.body);
        }
      }

      return err;
    })
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: path.join(config.logs, 'combined.log'),
      handleExceptions: true,
      handleRejections: true,
      maxsize: 10000000,
      maxFiles: 2
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;