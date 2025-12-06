import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour créer une réservation
 */
export class CreateReservationDto {
  @ApiProperty({ description: 'ID de l\'offre', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  offerId: string;

  @ApiProperty({ description: 'Nombre de voyageurs', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  numberOfGuests: number;

  @ApiPropertyOptional({ description: 'Demandes spéciales', example: 'Chambre avec vue sur mer' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Date de départ personnalisée (ISO 8601)', example: '2025-06-15T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({ description: 'Date de retour personnalisée (ISO 8601)', example: '2025-06-22T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;
}

