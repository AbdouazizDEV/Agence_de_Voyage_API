import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Payment } from './entities/payment.entity';

/**
 * Repository pour les paiements
 */
@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    reservation_id: string;
    amount: number;
    currency: string;
    payment_method: string;
    transaction_id?: string;
  }): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data,
    });

    return this.mapPrismaToPayment(payment);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    return payment ? this.mapPrismaToPayment(payment) : null;
  }

  async findByReservationId(reservationId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { reservation_id: reservationId },
      orderBy: { created_at: 'desc' },
    });

    return payments.map(this.mapPrismaToPayment);
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: data as any,
    });

    return this.mapPrismaToPayment(payment);
  }

  async refund(
    id: string,
    refundAmount: number,
    reason?: string,
  ): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'refunded',
        refund_amount: refundAmount,
        refund_date: new Date(),
        refund_reason: reason,
      },
    });

    return this.mapPrismaToPayment(payment);
  }

  private mapPrismaToPayment(payment: any): Payment {
    return {
      ...payment,
      amount:
        typeof payment.amount === 'object' && payment.amount !== null
          ? parseFloat(payment.amount.toString())
          : payment.amount,
      refund_amount:
        payment.refund_amount && typeof payment.refund_amount === 'object'
          ? parseFloat(payment.refund_amount.toString())
          : payment.refund_amount,
    };
  }
}
