import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from '../constants/error-codes.constants';

/**
 * Filtre spécialisé pour les erreurs de validation
 * Principe SOLID : Single Responsibility - Gère uniquement les erreurs de validation
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || exception.message
        : exception.message;

    const errorResponse = {
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: Array.isArray(message) ? message.join(', ') : message,
        details:
          typeof exceptionResponse === 'object' && exceptionResponse !== null
            ? (exceptionResponse as any).message
            : null,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.getStatus()).json(errorResponse);
  }
}
