import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour créer un client (Admin)
 */
export class CreateClientDto {
  @ApiProperty({ description: 'Email du client', example: 'client@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe', example: 'SecurePass123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiProperty({ description: 'Prénom', example: 'Mamadou' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom', example: 'FALL' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone', example: '221771234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}

