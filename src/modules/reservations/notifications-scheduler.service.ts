import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsRepository } from './notifications.repository';

/**
 * Service pour planifier les notifications automatiques
 * Alerte les clients de l'approche de la date de réservation
 */
@Injectable()
export class NotificationsSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  onModuleInit() {
    this.logger.log('Service de notifications automatiques initialisé');
  }

  /**
   * Vérifie quotidiennement les réservations à venir et envoie des notifications
   * Exécuté tous les jours à 9h00
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkUpcomingReservations() {
    this.logger.log('Vérification des réservations à venir...');

    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    // Réservations dans 7 jours
    const reservations7Days = await this.prisma.reservation.findMany({
      where: {
        status: 'confirmed',
        departure_date: {
          gte: now,
          lte: in7Days,
        },
      },
      include: {
        client: true,
        offer: true,
      },
    });

    for (const reservation of reservations7Days) {
      if (reservation.departure_date) {
        const daysUntil = Math.ceil(
          (reservation.departure_date.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Vérifier si une notification a déjà été envoyée aujourd'hui pour cette réservation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingNotification = await this.prisma.notification.findFirst({
          where: {
            reservation_id: reservation.id,
            type: 'reservation_reminder',
            created_at: {
              gte: today,
            },
          },
        });

        if (existingNotification) {
          continue; // Skip si notification déjà envoyée aujourd'hui
        }

        // Notification à 7 jours
        if (daysUntil === 7) {
          await this.notificationsRepository.create({
            client_id: reservation.client_id,
            reservation_id: reservation.id,
            type: 'reservation_reminder',
            title: 'Rappel de réservation',
            message: `Votre voyage "${reservation.offer.title}" commence dans 7 jours (${reservation.departure_date.toLocaleDateString('fr-FR')}). Préparez-vous !`,
          });
        }

        // Notification à 3 jours
        if (daysUntil === 3) {
          await this.notificationsRepository.create({
            client_id: reservation.client_id,
            reservation_id: reservation.id,
            type: 'reservation_reminder',
            title: 'Rappel de réservation',
            message: `Votre voyage "${reservation.offer.title}" commence dans 3 jours. N'oubliez pas de préparer vos documents !`,
          });
        }

        // Notification à 1 jour
        if (daysUntil === 1) {
          await this.notificationsRepository.create({
            client_id: reservation.client_id,
            reservation_id: reservation.id,
            type: 'reservation_reminder',
            title: 'Départ demain !',
            message: `Votre voyage "${reservation.offer.title}" commence demain. Bon voyage !`,
          });
        }
      }
    }

    this.logger.log(
      `Notifications envoyées pour ${reservations7Days.length} réservation(s)`,
    );
  }

  /**
   * Vérifie les réservations en attente de paiement
   * Exécuté toutes les heures
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkPendingPayments() {
    this.logger.log('Vérification des réservations en attente de paiement...');

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingReservations = await this.prisma.reservation.findMany({
      where: {
        status: 'pending',
        created_at: {
          lte: oneDayAgo,
        },
      },
      include: {
        client: true,
        offer: true,
        payments: {
          where: {
            status: 'completed',
          },
        },
      },
    });

    for (const reservation of pendingReservations) {
      // Si pas de paiement complété après 24h, envoyer un rappel
      if (reservation.payments.length === 0) {
        // Vérifier si un rappel a déjà été envoyé aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingReminder = await this.prisma.notification.findFirst({
          where: {
            reservation_id: reservation.id,
            type: 'payment_reminder',
            created_at: {
              gte: today,
            },
          },
        });

        if (!existingReminder) {
          await this.notificationsRepository.create({
            client_id: reservation.client_id,
            reservation_id: reservation.id,
            type: 'payment_reminder',
            title: 'Paiement en attente',
            message: `N'oubliez pas de finaliser le paiement pour votre réservation "${reservation.offer.title}". Montant: ${reservation.total_amount} ${reservation.currency}`,
          });
        }
      }
    }

    this.logger.log(
      `Rappels de paiement envoyés pour ${pendingReservations.length} réservation(s)`,
    );
  }
}
