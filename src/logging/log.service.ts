import { Injectable } from '@nestjs/common';
import { errorLogger, infoLogger, warnLogger } from '../configs/winston.config';

@Injectable()
export class LoggerService {
  constructor() {}

  logError(message: string, trace?: string) {
    errorLogger.error(message, trace);
  }

  logWarn(message: string, trace?: string) {
    warnLogger.warn(message, trace);
  }

  logInfo(message: string, trace?: string) {
    infoLogger.info(message, trace);
  }
}