import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour l'enregistrement d'un admin
 * Principe SOLID : Single Responsibility - Gère uniquement les données d'enregistrement
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Email de l\'administrateur',
    example: 'admin@travel-agency.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiProperty({
    description: 'Prénom',
    example: 'Abdou Aziz',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Nom',
    example: 'DIOP',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Rôle',
    example: 'admin',
    enum: ['admin', 'super_admin'],
    required: false,
  })
  @IsString()
  role?: string;
}

