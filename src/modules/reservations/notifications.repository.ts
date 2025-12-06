import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Repository pour les notifications
 */
@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    client_id: string;
    reservation_id?: string;
    type: string;
    title: string;
    message: string;
  }) {
    return this.prisma.notification.create({
      data,
    });
  }

  async findByClientId(clientId: string, filters?: {
    isRead?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      client_id: clientId,
      ...(filters?.isRead !== undefined && { is_read: filters.isRead }),
      ...(filters?.type && { type: filters.type }),
    };

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data, total };
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  async markAllAsRead(clientId: string) {
    return this.prisma.notification.updateMany({
      where: {
        client_id: clientId,
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  async getUnreadCount(clientId: string) {
    return this.prisma.notification.count({
      where: {
        client_id: clientId,
        is_read: false,
      },
    });
  }
}

