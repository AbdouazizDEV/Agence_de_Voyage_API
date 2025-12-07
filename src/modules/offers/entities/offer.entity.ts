/**
 * Entité Offer
 * Principe SOLID : Single Responsibility - Représente uniquement l'entité Offer
 */
export interface Offer {
  id: string;
  title: string;
  slug: string;
  destination: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  description: string;
  images: string[];
  itinerary: any[];
  included: string[];
  excluded: string[];
  is_active: boolean;
  is_promotion: boolean;
  promotion_discount?: number;
  promotion_ends_at?: Date;
  rating: number;
  reviews_count: number;
  bookings_count: number;
  views_count: number;
  available_seats: number;
  max_capacity?: number;
  departure_date?: Date;
  return_date?: Date;
  tags: string[];
  difficulty?: 'easy' | 'moderate' | 'hard';
  created_at: Date;
  updated_at: Date;
}
