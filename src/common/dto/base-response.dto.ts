import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de réponse standardisé
 * Principe SOLID : Single Responsibility - Format de réponse uniforme
 */
export class BaseResponseDto<T = any> {
  @ApiProperty({ example: true, description: 'Indique si la requête a réussi' })
  success: boolean;

  @ApiPropertyOptional({ description: 'Données de la réponse' })
  data?: T;

  @ApiPropertyOptional({
    example: 'Opération réussie',
    description: 'Message informatif',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Informations de pagination',
    example: {
      page: 1,
      limit: 12,
      total: 100,
      totalPages: 9,
    },
  })
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
