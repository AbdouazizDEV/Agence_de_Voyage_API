/**
 * Entité Payment
 */
export interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: Date;
  refund_amount?: number;
  refund_date?: Date;
  refund_reason?: string;
  created_at: Date;
  updated_at: Date;
}

