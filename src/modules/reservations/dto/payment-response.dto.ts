import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de réponse pour un paiement
 */
export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reservation_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  payment_method: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  transaction_id?: string;

  @ApiPropertyOptional()
  payment_date?: Date;

  @ApiPropertyOptional()
  refund_amount?: number;

  @ApiProperty()
  created_at: Date;
}
