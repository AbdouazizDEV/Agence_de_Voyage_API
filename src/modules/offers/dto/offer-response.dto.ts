import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de réponse pour une offre
 * Principe SOLID : Single Responsibility - Gère uniquement la réponse
 */
export class OfferResponseDto {
  @ApiProperty({ description: "ID de l'offre" })
  id: string;

  @ApiProperty({ description: 'Titre' })
  title: string;

  @ApiProperty({ description: 'Slug' })
  slug: string;

  @ApiProperty({ description: 'Destination' })
  destination: string;

  @ApiProperty({ description: 'Catégorie' })
  category: string;

  @ApiProperty({ description: 'Prix' })
  price: number;

  @ApiProperty({ description: 'Devise' })
  currency: string;

  @ApiProperty({ description: 'Durée en jours' })
  duration: number;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiPropertyOptional({ description: 'Images', type: [String] })
  images?: string[];

  @ApiPropertyOptional({ description: 'Itinéraire' })
  itinerary?: any[];

  @ApiPropertyOptional({ description: 'Services inclus', type: [String] })
  included?: string[];

  @ApiPropertyOptional({ description: 'Services exclus', type: [String] })
  excluded?: string[];

  @ApiProperty({ description: 'Active' })
  is_active: boolean;

  @ApiProperty({ description: 'En promotion' })
  is_promotion: boolean;

  @ApiPropertyOptional({ description: 'Remise (%)' })
  promotion_discount?: number;

  @ApiPropertyOptional({ description: 'Note' })
  rating: number;

  @ApiPropertyOptional({ description: 'Nombre de réservations' })
  bookings_count: number;

  @ApiPropertyOptional({ description: 'Places disponibles' })
  available_seats: number;

  @ApiPropertyOptional({ description: 'Date de départ' })
  departure_date?: Date;

  @ApiPropertyOptional({ description: 'Date de retour' })
  return_date?: Date;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Date de création' })
  created_at: Date;
}
