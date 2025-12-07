import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO pour mettre à jour une offre avec FormData (pour upload d'images)
 */
export class UpdateOfferFormDto {
  @ApiPropertyOptional({
    description: "Titre de l'offre",
    example: 'Séjour à Paris',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Destination', example: 'Paris, France' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description:
      'Catégorie (nom de la catégorie, ex: "Vols", "Hôtels", "Croisières", etc.)',
    example: 'Vols',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Prix', example: 150000, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number | string;

  @ApiPropertyOptional({
    description: 'Devise',
    example: 'FCFA',
    default: 'FCFA',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Durée en jours',
    example: 5,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration?: number | string;

  @ApiPropertyOptional({
    description: 'Description complète',
    example: 'Découvrez la ville lumière...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description:
      'Nouveaux fichiers images à uploader (seront ajoutés aux images existantes)',
  })
  @IsOptional()
  images?: any[]; // This will be handled by Multer

  @ApiPropertyOptional({
    description: 'Itinéraire (JSON string)',
    type: String,
  })
  @IsOptional()
  @IsString()
  itinerary?: string; // JSON string

  @ApiPropertyOptional({
    description: 'Services inclus (JSON string)',
    type: String,
  })
  @IsOptional()
  @IsString()
  included?: string; // JSON string array

  @ApiPropertyOptional({
    description: 'Services exclus (JSON string)',
    type: String,
  })
  @IsOptional()
  @IsString()
  excluded?: string; // JSON string array

  @ApiPropertyOptional({
    description: 'Offre active ?',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_active?: boolean | string;

  @ApiPropertyOptional({
    description: 'Offre en promotion ?',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_promotion?: boolean | string;

  @ApiPropertyOptional({
    description: 'Pourcentage de réduction (0-100)',
    example: 15,
    type: Number,
  })
  @ValidateIf(
    (o) =>
      o.is_promotion === true ||
      o.is_promotion === 'true' ||
      o.is_promotion === '1',
  )
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  promotion_discount?: number | string;

  @ApiPropertyOptional({
    description: 'Date de fin de promotion (ISO 8601)',
    example: '2025-12-31T23:59:59Z',
  })
  @ValidateIf((o) => o.is_promotion === true)
  @IsOptional()
  @IsDateString()
  promotion_ends_at?: string;

  @ApiPropertyOptional({
    description: 'Nombre de sièges disponibles',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  available_seats?: number | string;

  @ApiPropertyOptional({
    description: 'Capacité maximale',
    example: 20,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_capacity?: number | string;

  @ApiPropertyOptional({
    description: 'Date de départ (ISO 8601)',
    example: '2025-01-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  departure_date?: string;

  @ApiPropertyOptional({
    description: 'Date de retour (ISO 8601)',
    example: '2025-01-20T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  return_date?: string;

  @ApiPropertyOptional({ description: 'Tags (JSON string)', type: String })
  @IsOptional()
  @IsString()
  tags?: string; // JSON string array

  @ApiPropertyOptional({
    description: 'Niveau de difficulté',
    example: 'easy',
    enum: ['easy', 'moderate', 'hard'],
  })
  @IsOptional()
  @IsEnum(['easy', 'moderate', 'hard'])
  difficulty?: string;

  @ApiPropertyOptional({
    type: 'string',
    description:
      'Action pour les images : "add" (ajouter aux existantes) ou "replace" (remplacer toutes). Par défaut: "add"',
    enum: ['add', 'replace'],
    example: 'add',
  })
  @IsOptional()
  @IsEnum(['add', 'replace'])
  images_action?: string; // 'add' ou 'replace'
}
