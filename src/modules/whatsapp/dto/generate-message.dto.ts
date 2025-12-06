import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour générer un message WhatsApp
 */
export class GenerateMessageDto {
  @ApiProperty({ description: 'ID de l\'offre', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  offerId: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '221761885485' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Nom du client', example: 'John Doe' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Message personnalisé' })
  @IsOptional()
  @IsString()
  customMessage?: string;
}

