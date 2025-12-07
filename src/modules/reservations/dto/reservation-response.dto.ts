import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de réponse pour une réservation
 */
export class ReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  client_id: string;

  @ApiProperty()
  offer_id: string;

  @ApiProperty()
  number_of_guests: number;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reservation_date: Date;

  @ApiPropertyOptional()
  departure_date?: Date;

  @ApiPropertyOptional()
  return_date?: Date;

  @ApiPropertyOptional()
  special_requests?: string;

  @ApiProperty()
  created_at: Date;
}
