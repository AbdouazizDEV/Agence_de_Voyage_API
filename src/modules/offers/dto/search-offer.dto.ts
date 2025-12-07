import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour recherche d'offres
 * Principe SOLID : Single Responsibility - Gère uniquement les critères de recherche
 */
export class SearchOfferDto {
  @ApiPropertyOptional({
    description:
      'Recherche textuelle générale (cherche dans titre, description, destination). Supporte les débuts de mots et lettres.',
    example: 'Par',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Destination (recherche partielle)',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description:
      'Catégorie (nom de la catégorie, ex: "Vols", "Hôtels", "Croisières", etc.)',
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

  @ApiPropertyOptional({
    description: 'Date de départ (ISO 8601)',
    example: '2025-06-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({
    description: 'Date de retour (ISO 8601)',
    example: '2025-06-22T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional({ description: 'Nombre de voyageurs', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  travelers?: number;

  @ApiPropertyOptional({
    description: 'Uniquement les promotions',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPromotion?: boolean;

  @ApiPropertyOptional({
    description: 'Tags (recherche par tags)',
    example: ['plage', 'romantique'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Niveau de difficulté',
    enum: ['easy', 'moderate', 'hard'],
    example: 'easy',
  })
  @IsOptional()
  @IsEnum(['easy', 'moderate', 'hard'])
  difficulty?: string;

  @ApiPropertyOptional({
    description: 'Note minimum',
    example: 4.0,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Durée minimum (en jours)', example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minDuration?: number;

  @ApiPropertyOptional({ description: 'Durée maximum (en jours)', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxDuration?: number;

  @ApiPropertyOptional({
    description: 'Tri des résultats',
    enum: ['price', 'duration', 'rating', 'createdAt', 'bookings', 'views'],
    example: 'price',
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['price', 'duration', 'rating', 'createdAt', 'bookings', 'views'])
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Ordre de tri',
    enum: ['asc', 'desc'],
    example: 'asc',
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string;

  @ApiPropertyOptional({
    description: 'Page (pour pagination)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Nombre de résultats par page',
    example: 12,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
