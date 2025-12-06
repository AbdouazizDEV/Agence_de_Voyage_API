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

/**
 * DTO pour créer une offre
 * Principe SOLID : Single Responsibility - Gère uniquement les données de création
 */
export class CreateOfferDto {
  @ApiProperty({ description: 'Titre de l\'offre', example: 'Séjour à Paris' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Destination',
    example: 'Paris, France',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    description: 'Catégorie (nom de la catégorie, ex: "Vols", "Hôtels", "Croisières", etc.)',
    example: 'Séjours',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Prix', example: 150000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Devise', example: 'FCFA', default: 'FCFA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Durée en jours', example: 7 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Description détaillée' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Itinéraire (JSON)', type: Array })
  @IsOptional()
  itinerary?: any[];

  @ApiPropertyOptional({ description: 'Services inclus', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included?: string[];

  @ApiPropertyOptional({ description: 'Services exclus', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excluded?: string[];

  @ApiPropertyOptional({ description: 'Offre active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'En promotion', default: false })
  @IsOptional()
  @IsBoolean()
  is_promotion?: boolean;

  @ApiPropertyOptional({ description: 'Remise promotionnelle (%)', minimum: 0, maximum: 100 })
  @ValidateIf((o) => o.is_promotion === true)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  promotion_discount?: number;

  @ApiPropertyOptional({ description: 'Date de fin de promotion' })
  @ValidateIf((o) => o.is_promotion === true)
  @IsOptional()
  @IsDateString()
  promotion_ends_at?: string;

  @ApiPropertyOptional({ description: 'Capacité maximale' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  max_capacity?: number;

  @ApiPropertyOptional({ description: 'Date de départ' })
  @IsOptional()
  @IsDateString()
  departure_date?: string;

  @ApiPropertyOptional({ description: 'Date de retour' })
  @IsOptional()
  @IsDateString()
  return_date?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Difficulté',
    enum: ['easy', 'moderate', 'hard'],
  })
  @IsOptional()
  @IsEnum(['easy', 'moderate', 'hard'])
  difficulty?: string;
}

