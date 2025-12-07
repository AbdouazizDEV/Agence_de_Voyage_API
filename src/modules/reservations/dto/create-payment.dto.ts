import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour créer un paiement
 */
export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de la réservation', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  reservationId: string;

  @ApiProperty({
    description: 'Méthode de paiement',
    enum: ['card', 'mobile_money', 'bank_transfer', 'cash'],
    example: 'card',
  })
  @IsEnum(['card', 'mobile_money', 'bank_transfer', 'cash'])
  paymentMethod: string;

  @ApiPropertyOptional({
    description: 'ID de transaction (pour simulation)',
    example: 'TXN123456',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
