/**
 * Entité Reservation
 */
export interface Reservation {
  id: string;
  client_id: string;
  offer_id: string;
  number_of_guests: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservation_date: Date;
  departure_date?: Date;
  return_date?: Date;
  special_requests?: string;
  cancellation_reason?: string;
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
}
