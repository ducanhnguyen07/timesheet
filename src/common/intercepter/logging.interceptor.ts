import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../../../src/logging/log.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user ? request.user : { id: 'anonymous' };
    const { method, url } = request;
    const message = `${method} ${url} by user ${user['id']}`;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = `${Date.now() - now}ms`;
        this.loggerService.logInfo(`${message} - ${responseTime}`);
      }),
      catchError((err) => {
        const responseTime = `${Date.now() - now}ms`;
        if (err instanceof HttpException) {
          const statusCode = err.getStatus();

          if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.loggerService.logError(
              `${message} - ${responseTime} - Error: ${err.message}`,
              err.stack,
            );
          } else if (statusCode >= HttpStatus.BAD_REQUEST) {
            this.loggerService.logWarn(
              `${message} - ${responseTime} - Warning: ${err.message}`,
            );
          }
        } else {
          this.loggerService.logError(
            `${message} - ${responseTime} - Unexpected error: ${err.message}`,
            err.stack,
          );
        }
        throw err;
      }),
    );
  }
}
