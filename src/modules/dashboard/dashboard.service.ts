import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalOffers, activeOffers, promotions, offers] = await Promise.all([
      this.prisma.offer.count(),
      this.prisma.offer.count({ where: { is_active: true } }),
      this.prisma.offer.count({ where: { is_promotion: true } }),
      this.prisma.offer.findMany({ select: { bookings_count: true } }),
    ]);

    const totalBookings = offers.reduce(
      (sum, offer) => sum + (offer.bookings_count || 0),
      0,
    );

    return {
      success: true,
      data: {
        totalOffers,
        activeOffers,
        promotions,
        totalBookings,
      },
    };
  }
}
