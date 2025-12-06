import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from '../constants/error-codes.constants';

/**
 * Filtre global pour gestion des erreurs HTTP
 * Principe SOLID : Single Responsibility - Gère uniquement les erreurs HTTP
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = ERROR_CODES.INTERNAL_SERVER_ERROR as string;
    let message = 'Une erreur est survenue';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        // Support à la fois 'code' et 'errorCode' pour compatibilité
        errorCode = responseObj.code || responseObj.errorCode || this.getErrorCodeFromStatus(status);
        details = responseObj.details || null;
      } else {
        message = exceptionResponse as string;
        errorCode = this.getErrorCodeFromStatus(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ERROR_CODES.VALIDATION_ERROR as string;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED as string;
      case HttpStatus.FORBIDDEN:
        return ERROR_CODES.FORBIDDEN as string;
      case HttpStatus.NOT_FOUND:
        return ERROR_CODES.NOT_FOUND as string;
      case HttpStatus.CONFLICT:
        return ERROR_CODES.RESOURCE_ALREADY_EXISTS as string;
      default:
        return ERROR_CODES.INTERNAL_SERVER_ERROR as string;
    }
  }
}

