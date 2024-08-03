import * as winston from 'winston';
import 'winston-daily-rotate-file';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] : ${info.message}`,
  ),
);

const errorTransport = new winston.transports.DailyRotateFile({
  filename: `logs/%DATE%-error.log`,
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '3d',
  handleExceptions: true,
});

const warnTransport = new winston.transports.DailyRotateFile({
  filename: `logs/%DATE%-warn.log`,
  level: 'warn',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '3d',
});

const infoTransport = new winston.transports.DailyRotateFile({
  filename: `logs/%DATE%-info.log`,
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '3d',
});

export const errorLogger = winston.createLogger({
  level: 'error',
  format,
  transports: [new winston.transports.Console(), errorTransport],
});

export const warnLogger = winston.createLogger({
  level: 'warn',
  format,
  transports: [new winston.transports.Console(), warnTransport],
});

export const infoLogger = winston.createLogger({
  level: 'info',
  format,
  transports: [new winston.transports.Console(), infoTransport],
});
