import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour annuler une réservation
 */
export class CancelReservationDto {
  @ApiPropertyOptional({ description: 'Raison de l\'annulation', example: 'Changement de plan' })
  @IsOptional()
  @IsString()
  reason?: string;
}

