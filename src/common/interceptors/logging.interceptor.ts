import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor pour logging des requêtes/réponses
 * Principe SOLID : Single Responsibility - Gère uniquement le logging
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    this.logger.log(`${method} ${url} - Request started`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} - ${error.message} - ${duration}ms`,
          );
        },
      }),
    );
  }
}

