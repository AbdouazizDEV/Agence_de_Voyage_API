import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour recherche d'offres
 * Principe SOLID : Single Responsibility - Gère uniquement les critères de recherche
 */
export class SearchOfferDto {
  @ApiPropertyOptional({ description: 'Destination', example: 'Paris' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description: 'Catégorie (nom de la catégorie, ex: "Vols", "Hôtels", "Croisières", etc.)',
    example: 'Séjours',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Prix minimum', example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Prix maximum', example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Date de départ' })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({ description: 'Date de retour' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional({ description: 'Nombre de voyageurs', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  travelers?: number;

  @ApiPropertyOptional({ description: 'Uniquement les promotions', default: false })
  @IsOptional()
  isPromotion?: boolean;
}

