import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PaymentsService } from './payments.service';
import { NotificationsService } from './notifications.service';
import { NotificationsSchedulerService } from './notifications-scheduler.service';
import { ReservationsRepository } from './reservations.repository';
import { PaymentsRepository } from './payments.repository';
import { NotificationsRepository } from './notifications.repository';
import { PrismaService } from '../../database/prisma.service';

/**
 * Module Réservations
 */
@Module({
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    PaymentsService,
    NotificationsService,
    NotificationsSchedulerService,
    ReservationsRepository,
    PaymentsRepository,
    NotificationsRepository,
    PrismaService,
  ],
  exports: [ReservationsService, NotificationsService],
})
export class ReservationsModule {}

