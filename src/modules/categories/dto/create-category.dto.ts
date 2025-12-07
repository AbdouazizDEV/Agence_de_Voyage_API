import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour créer une catégorie
 */
export class CreateCategoryDto {
  @ApiProperty({ description: 'Nom de la catégorie', example: 'Vol' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description',
    example: "Billets d'avion uniquement",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Icône', example: '✈️' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: "Ordre d'affichage",
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
