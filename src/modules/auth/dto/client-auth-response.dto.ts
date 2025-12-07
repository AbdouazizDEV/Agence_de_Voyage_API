import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de réponse d'authentification client
 */
export class ClientAuthResponseDto {
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
    description: 'Informations du client',
    example: {
      id: 'uuid',
      email: 'client@example.com',
      firstName: 'Mamadou',
      lastName: 'FALL',
      phone: '221771234567',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}
