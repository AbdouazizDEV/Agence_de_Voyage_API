import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Reservation } from './entities/reservation.entity';
import { Payment } from './entities/payment.entity';
import { Prisma } from '@prisma/client';

/**
 * Repository pour les réservations
 */
@Injectable()
export class ReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    client_id: string;
    offer_id: string;
    number_of_guests: number;
    total_amount: number;
    currency: string;
    reservation_date: Date;
    departure_date?: Date;
    return_date?: Date;
    special_requests?: string;
  }): Promise<Reservation> {
    const reservation = await this.prisma.reservation.create({
      data,
      include: {
        offer: true,
        payments: true,
      },
    });

    return this.mapPrismaToReservation(reservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        offer: true,
        payments: true,
      },
    });

    return reservation ? this.mapPrismaToReservation(reservation) : null;
  }

  async findByClientId(
    clientId: string,
    filters?: {
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Reservation[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ReservationWhereInput = {
      client_id: clientId,
      ...(filters?.status && { status: filters.status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        include: {
          offer: true,
          payments: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      data: data.map(this.mapPrismaToReservation),
      total,
    };
  }

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: data as any,
      include: {
        offer: true,
        payments: true,
      },
    });

    return this.mapPrismaToReservation(reservation);
  }

  async cancel(id: string, reason?: string): Promise<Reservation> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date(),
      },
      include: {
        offer: true,
        payments: true,
      },
    });

    return this.mapPrismaToReservation(reservation);
  }

  private mapPrismaToReservation(reservation: any): Reservation {
    return {
      ...reservation,
      total_amount:
        typeof reservation.total_amount === 'object' &&
        reservation.total_amount !== null
          ? parseFloat(reservation.total_amount.toString())
          : reservation.total_amount,
    };
  }
}
