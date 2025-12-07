import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Statistiques des offres
    const [
      totalOffers,
      activeOffers,
      promotions,
      offersWithRating,
      totalViews,
    ] = await Promise.all([
      this.prisma.offer.count(),
      this.prisma.offer.count({ where: { is_active: true } }),
      this.prisma.offer.count({
        where: {
          is_promotion: true,
          promotion_ends_at: { gt: now },
        },
      }),
      this.prisma.offer.findMany({
        where: { rating: { gt: 0 } },
        select: { rating: true },
      }),
      this.prisma.offer.aggregate({
        _sum: { views_count: true },
      }),
    ]);

    const inactiveOffers = totalOffers - activeOffers;
    const averageRating =
      offersWithRating.length > 0
        ? offersWithRating.reduce(
            (sum, offer) =>
              sum +
              (typeof offer.rating === 'object' && offer.rating !== null
                ? parseFloat(offer.rating.toString())
                : offer.rating || 0),
            0,
          ) / offersWithRating.length
        : 0;

    // Statistiques des clients
    const [totalClients, activeClients, newClientsThisMonth] =
      await Promise.all([
        this.prisma.client.count(),
        this.prisma.client.count({ where: { is_active: true } }),
        this.prisma.client.count({
          where: {
            created_at: { gte: startOfMonth },
          },
        }),
      ]);

    // Statistiques des réservations
    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      completedReservations,
      reservationsThisMonth,
      reservationsWithAmount,
    ] = await Promise.all([
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { status: 'pending' } }),
      this.prisma.reservation.count({ where: { status: 'confirmed' } }),
      this.prisma.reservation.count({ where: { status: 'cancelled' } }),
      this.prisma.reservation.count({ where: { status: 'completed' } }),
      this.prisma.reservation.count({
        where: {
          created_at: { gte: startOfMonth },
        },
      }),
      this.prisma.reservation.findMany({
        where: { status: { in: ['confirmed', 'completed'] } },
        select: { total_amount: true },
      }),
    ]);

    // Calcul du montant moyen par réservation
    const totalReservationsAmount = reservationsWithAmount.reduce(
      (sum, reservation) =>
        sum +
        (typeof reservation.total_amount === 'object' &&
        reservation.total_amount !== null
          ? parseFloat(reservation.total_amount.toString())
          : reservation.total_amount || 0),
      0,
    );
    const averageBookingValue =
      reservationsWithAmount.length > 0
        ? totalReservationsAmount / reservationsWithAmount.length
        : 0;

    // Statistiques des paiements
    const [
      completedPaymentsData,
      pendingPayments,
      refundedPayments,
    ] = await Promise.all([
      this.prisma.payment.findMany({
        where: { status: 'completed' },
        select: { amount: true, payment_date: true },
      }),
      this.prisma.payment.count({ where: { status: 'pending' } }),
      this.prisma.payment.findMany({
        where: { refund_amount: { not: null } },
        select: { refund_amount: true },
      }),
    ]);

    // Revenus totaux (paiements complétés)
    const totalRevenue = completedPaymentsData.reduce(
      (sum, payment) =>
        sum +
        (typeof payment.amount === 'object' && payment.amount !== null
          ? parseFloat(payment.amount.toString())
          : payment.amount || 0),
      0,
    );

    // Revenus du mois (paiements complétés ce mois)
    const revenueThisMonth = completedPaymentsData
      .filter(
        (payment) =>
          payment.payment_date &&
          new Date(payment.payment_date) >= startOfMonth,
      )
      .reduce(
        (sum, payment) =>
          sum +
          (typeof payment.amount === 'object' && payment.amount !== null
            ? parseFloat(payment.amount.toString())
            : payment.amount || 0),
        0,
      );

    // Montant total remboursé
    const refundedAmount = refundedPayments.reduce(
      (sum, payment) =>
        sum +
        (payment.refund_amount &&
        typeof payment.refund_amount === 'object'
          ? parseFloat(payment.refund_amount.toString())
          : payment.refund_amount || 0),
      0,
    );

    const completedPayments = completedPaymentsData.length;

    // Statistiques des notifications
    const [unreadNotifications, totalNotifications] = await Promise.all([
      this.prisma.notification.count({ where: { is_read: false } }),
      this.prisma.notification.count(),
    ]);

    // Catégorie la plus populaire (par nombre de réservations)
    // Trouver l'offre avec le plus de réservations
    const topOffer = await this.prisma.offer.findFirst({
      where: { bookings_count: { gt: 0 } },
      orderBy: { bookings_count: 'desc' },
      select: { category: true },
    });

    const topCategory = topOffer?.category || null;

    // Taux de conversion (réservations / vues totales)
    const totalViewsCount = totalViews._sum.views_count || 0;
    const conversionRate =
      totalViewsCount > 0
        ? (totalReservations / totalViewsCount) * 100
        : 0;

    return {
      success: true,
      data: {
        // Offres
        totalOffers,
        activeOffers,
        inactiveOffers,
        promotions,
        averageRating: Math.round(averageRating * 10) / 10,

        // Clients
        totalClients,
        activeClients,
        newClientsThisMonth,

        // Réservations
        totalReservations,
        pendingReservations,
        confirmedReservations,
        cancelledReservations,
        completedReservations,
        reservationsThisMonth,

        // Revenus et paiements
        totalRevenue: Math.round(totalRevenue),
        revenueThisMonth: Math.round(revenueThisMonth),
        averageBookingValue: Math.round(averageBookingValue),
        pendingPayments,
        completedPayments,
        refundedAmount: Math.round(refundedAmount),

        // Notifications
        unreadNotifications,
        totalNotifications,

        // Autres métriques
        topCategory,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    };
  }
}
