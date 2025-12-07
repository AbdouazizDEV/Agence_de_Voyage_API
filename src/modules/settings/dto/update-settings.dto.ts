import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour mettre à jour les paramètres
 */
export class UpdateSettingsDto {
  @ApiPropertyOptional({ description: "Nom de l'entreprise" })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Email de contact' })
  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @ApiPropertyOptional({ description: 'Téléphone' })
  @IsOptional()
  @IsString()
  companyPhone?: string;

  @ApiPropertyOptional({ description: 'Numéro WhatsApp' })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiPropertyOptional({ description: 'Adresse' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Devise', example: 'FCFA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Template message WhatsApp' })
  @IsOptional()
  @IsString()
  whatsappMessageTemplate?: string;

  @ApiPropertyOptional({ description: 'WhatsApp activé' })
  @IsOptional()
  @IsBoolean()
  whatsappEnabled?: boolean;
}
