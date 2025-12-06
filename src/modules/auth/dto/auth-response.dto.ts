import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de réponse d'authentification
 * Principe SOLID : Single Responsibility - Gère uniquement la réponse auth
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Informations de l\'utilisateur',
    example: {
      id: 'uuid',
      email: 'admin@travel-agency.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

