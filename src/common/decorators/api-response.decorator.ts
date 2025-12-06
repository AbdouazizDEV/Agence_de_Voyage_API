import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Decorator personnalisé pour documentation Swagger des réponses
 * Principe SOLID : Don't Repeat Yourself - Réutilisable sur tous les endpoints
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      description: 'Requête réussie',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: isArray
            ? { type: 'array', items: { $ref: getSchemaPath(model) } }
            : { $ref: getSchemaPath(model) },
          message: { type: 'string', example: 'Opération réussie' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Requête invalide',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Données invalides' },
              details: { type: 'object' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Non authentifié',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Token invalide ou manquant' },
            },
          },
        },
      },
    }),
  );
};

