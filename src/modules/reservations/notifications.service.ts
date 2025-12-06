import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { PaginationDto } from '../../common/dto/pagination.dto';

/**
 * Service pour la gestion des notifications
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async findAll(clientId: string, pagination: PaginationDto, filters?: any) {
    const result = await this.notificationsRepository.findByClientId(clientId, {
      isRead: filters?.isRead,
      type: filters?.type,
      page: pagination.page,
      limit: pagination.limit,
    });

    const totalPages = Math.ceil(result.total / (pagination.limit || 20));

    return {
      success: true,
      data: result.data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        total: result.total,
        totalPages,
        hasNext: (pagination.page || 1) < totalPages,
        hasPrevious: (pagination.page || 1) > 1,
      },
    };
  }

  async markAsRead(clientId: string, id: string) {
    // Vérifier que la notification appartient au client
    const notification = await this.notificationsRepository.findByClientId(clientId, { limit: 1000 });
    const notificationExists = notification.data.find(n => n.id === id);

    if (!notificationExists) {
      throw new NotFoundException('Notification non trouvée');
    }

    await this.notificationsRepository.markAsRead(id);

    return {
      success: true,
      message: 'Notification marquée comme lue',
    };
  }

  async markAllAsRead(clientId: string) {
    const result = await this.notificationsRepository.markAllAsRead(clientId);

    return {
      success: true,
      message: `${result.count} notification(s) marquée(s) comme lue(s)`,
    };
  }

  async getUnreadCount(clientId: string) {
    const count = await this.notificationsRepository.getUnreadCount(clientId);

    return {
      success: true,
      data: {
        unreadCount: count,
      },
    };
  }
}

