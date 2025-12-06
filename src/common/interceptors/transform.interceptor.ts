import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/api-response.interface';

/**
 * Interceptor pour transformation standardisée des réponses
 * Principe SOLID : Single Responsibility - Gère uniquement la transformation
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Si la réponse est déjà formatée, on la retourne telle quelle
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Sinon, on formate la réponse
        return {
          success: true,
          data,
        };
      }),
    );
  }
}

