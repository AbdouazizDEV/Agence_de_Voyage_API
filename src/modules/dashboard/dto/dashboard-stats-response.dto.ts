import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la réponse des statistiques du dashboard
 */
export class DashboardStatsResponseDto {
  @ApiProperty({
    description: 'Nombre total d\'offres',
    example: 12,
  })
  totalOffers: number;

  @ApiProperty({
    description: 'Nombre d\'offres actives',
    example: 11,
  })
  activeOffers: number;

  @ApiProperty({
    description: 'Nombre d\'offres inactives',
    example: 1,
  })
  inactiveOffers: number;

  @ApiProperty({
    description: 'Nombre d\'offres en promotion',
    example: 6,
  })
  promotions: number;

  @ApiProperty({
    description: 'Note moyenne des offres',
    example: 4.5,
  })
  averageRating: number;

  @ApiProperty({
    description: 'Nombre total de clients',
    example: 150,
  })
  totalClients: number;

  @ApiProperty({
    description: 'Nombre de clients actifs',
    example: 145,
  })
  activeClients: number;

  @ApiProperty({
    description: 'Nombre de nouveaux clients ce mois',
    example: 12,
  })
  newClientsThisMonth: number;

  @ApiProperty({
    description: 'Nombre total de réservations',
    example: 1707,
  })
  totalReservations: number;

  @ApiProperty({
    description: 'Réservations en attente',
    example: 15,
  })
  pendingReservations: number;

  @ApiProperty({
    description: 'Réservations confirmées',
    example: 1200,
  })
  confirmedReservations: number;

  @ApiProperty({
    description: 'Réservations annulées',
    example: 50,
  })
  cancelledReservations: number;

  @ApiProperty({
    description: 'Réservations complétées',
    example: 442,
  })
  completedReservations: number;

  @ApiProperty({
    description: 'Réservations créées ce mois',
    example: 85,
  })
  reservationsThisMonth: number;

  @ApiProperty({
    description: 'Revenus totaux (FCFA)',
    example: 125000000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Revenus du mois en cours (FCFA)',
    example: 8500000,
  })
  revenueThisMonth: number;

  @ApiProperty({
    description: 'Montant moyen par réservation (FCFA)',
    example: 73250,
  })
  averageBookingValue: number;

  @ApiProperty({
    description: 'Paiements en attente',
    example: 15,
  })
  pendingPayments: number;

  @ApiProperty({
    description: 'Paiements complétés',
    example: 1200,
  })
  completedPayments: number;

  @ApiProperty({
    description: 'Montant total remboursé (FCFA)',
    example: 2500000,
  })
  refundedAmount: number;

  @ApiProperty({
    description: 'Nombre de notifications non lues',
    example: 25,
  })
  unreadNotifications: number;

  @ApiProperty({
    description: 'Nombre total de notifications',
    example: 500,
  })
  totalNotifications: number;

  @ApiProperty({
    description: 'Catégorie la plus populaire',
    example: 'Séjours',
    nullable: true,
  })
  topCategory: string | null;

  @ApiProperty({
    description: 'Taux de conversion (réservations / vues) en pourcentage',
    example: 12.5,
  })
  conversionRate: number;
}

