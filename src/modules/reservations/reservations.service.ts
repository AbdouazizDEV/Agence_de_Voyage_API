import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import { PaymentsRepository } from './payments.repository';
import { NotificationsRepository } from './notifications.repository';
import { PrismaService } from '../../database/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

/**
 * Service pour la gestion des réservations
 */
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(clientId: string, createDto: CreateReservationDto) {
    // Vérifier que l'offre existe et est active
    const offer = await this.prisma.offer.findUnique({
      where: { id: createDto.offerId },
    });

    if (!offer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    if (!offer.is_active) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Cette offre n'est plus disponible",
      });
    }

    // Vérifier les places disponibles
    if (offer.max_capacity && createDto.numberOfGuests > offer.max_capacity) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Nombre de voyageurs supérieur à la capacité maximale (${offer.max_capacity})`,
      });
    }

    if (
      createDto.numberOfGuests > offer.available_seats &&
      offer.available_seats > 0
    ) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Places insuffisantes. Places disponibles: ${offer.available_seats}`,
      });
    }

    // Calculer le montant total
    let totalAmount =
      parseFloat(offer.price.toString()) * createDto.numberOfGuests;

    // Appliquer la réduction si promotion
    if (offer.is_promotion && offer.promotion_discount) {
      const discount = (totalAmount * offer.promotion_discount) / 100;
      totalAmount = totalAmount - discount;
    }

    // Créer la réservation
    const reservation = await this.reservationsRepository.create({
      client_id: clientId,
      offer_id: createDto.offerId,
      number_of_guests: createDto.numberOfGuests,
      total_amount: totalAmount,
      currency: offer.currency,
      reservation_date: new Date(),
      departure_date: createDto.departureDate
        ? new Date(createDto.departureDate)
        : offer.departure_date
          ? new Date(offer.departure_date)
          : undefined,
      return_date: createDto.returnDate
        ? new Date(createDto.returnDate)
        : offer.return_date
          ? new Date(offer.return_date)
          : undefined,
      special_requests: createDto.specialRequests,
    });

    // Décrémenter les places disponibles
    await this.prisma.offer.update({
      where: { id: createDto.offerId },
      data: {
        available_seats: {
          decrement: createDto.numberOfGuests,
        },
        bookings_count: {
          increment: 1,
        },
      },
    });

    // Créer une notification
    await this.notificationsRepository.create({
      client_id: clientId,
      reservation_id: reservation.id,
      type: 'reservation_created',
      title: 'Réservation créée',
      message: `Votre réservation pour "${offer.title}" a été créée. Montant total: ${totalAmount} ${offer.currency}`,
    });

    return {
      success: true,
      data: reservation,
      message: 'Réservation créée avec succès',
    };
  }

  async findAll(clientId: string, pagination: PaginationDto, filters?: any) {
    const result = await this.reservationsRepository.findByClientId(clientId, {
      status: filters?.status,
      page: pagination.page,
      limit: pagination.limit,
    });

    const totalPages = Math.ceil(result.total / (pagination.limit || 12));

    return {
      success: true,
      data: result.data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 12,
        total: result.total,
        totalPages,
        hasNext: (pagination.page || 1) < totalPages,
        hasPrevious: (pagination.page || 1) > 1,
      },
    };
  }

  async findOne(clientId: string, id: string) {
    const reservation = await this.reservationsRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    // Vérifier que la réservation appartient au client
    if (reservation.client_id !== clientId) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: "Vous n'avez pas accès à cette réservation",
      });
    }

    return {
      success: true,
      data: reservation,
    };
  }

  async cancel(clientId: string, id: string, cancelDto: CancelReservationDto) {
    const reservation = await this.reservationsRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    // Vérifier que la réservation appartient au client
    if (reservation.client_id !== clientId) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: "Vous n'avez pas accès à cette réservation",
      });
    }

    // Vérifier que la réservation peut être annulée
    if (reservation.status === 'cancelled') {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Cette réservation est déjà annulée',
      });
    }

    if (reservation.status === 'completed') {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Impossible d'annuler une réservation complétée",
      });
    }

    // Annuler la réservation
    const cancelledReservation = await this.reservationsRepository.cancel(
      id,
      cancelDto.reason,
    );

    // Rembourser les paiements
    const payments = await this.paymentsRepository.findByReservationId(id);
    for (const payment of payments) {
      if (payment.status === 'completed') {
        // Simuler le remboursement
        await this.paymentsRepository.refund(
          payment.id,
          payment.amount,
          cancelDto.reason || 'Annulation de réservation',
        );
      }
    }

    // Restaurer les places disponibles
    await this.prisma.offer.update({
      where: { id: reservation.offer_id },
      data: {
        available_seats: {
          increment: reservation.number_of_guests,
        },
      },
    });

    // Créer une notification
    await this.notificationsRepository.create({
      client_id: clientId,
      reservation_id: id,
      type: 'reservation_cancelled',
      title: 'Réservation annulée',
      message: `Votre réservation a été annulée. Le remboursement sera traité sous 5-7 jours ouvrés.`,
    });

    return {
      success: true,
      data: cancelledReservation,
      message: 'Réservation annulée avec succès. Remboursement en cours.',
    };
  }

  async createPayment(clientId: string, createDto: CreatePaymentDto) {
    // Vérifier que la réservation existe et appartient au client
    const reservation = await this.reservationsRepository.findById(
      createDto.reservationId,
    );

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    if (reservation.client_id !== clientId) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: "Vous n'avez pas accès à cette réservation",
      });
    }

    if (reservation.status === 'cancelled') {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Impossible de payer une réservation annulée',
      });
    }

    // Vérifier si un paiement existe déjà
    const existingPayments = await this.paymentsRepository.findByReservationId(
      createDto.reservationId,
    );
    const completedPayment = existingPayments.find(
      (p) => p.status === 'completed',
    );

    if (completedPayment) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Cette réservation a déjà été payée',
      });
    }

    // Générer un ID de transaction simulé
    const transactionId =
      createDto.transactionId ||
      `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Simuler le paiement (toujours réussi pour la démo)
    const payment = await this.paymentsRepository.create({
      reservation_id: createDto.reservationId,
      amount: reservation.total_amount,
      currency: reservation.currency,
      payment_method: createDto.paymentMethod,
      transaction_id: transactionId,
    });

    // Marquer le paiement comme complété (simulation)
    const completedPayment_ = await this.paymentsRepository.update(payment.id, {
      status: 'completed',
      payment_date: new Date(),
    });

    // Mettre à jour le statut de la réservation
    const updatedReservation = await this.reservationsRepository.update(
      createDto.reservationId,
      {
        status: 'confirmed',
      },
    );

    // Créer une notification
    await this.notificationsRepository.create({
      client_id: clientId,
      reservation_id: createDto.reservationId,
      type: 'payment_completed',
      title: 'Paiement effectué',
      message: `Votre paiement de ${reservation.total_amount} ${reservation.currency} a été effectué avec succès.`,
    });

    return {
      success: true,
      data: {
        payment: completedPayment_,
        reservation: updatedReservation,
      },
      message: 'Paiement effectué avec succès',
    };
  }

  async getPayments(clientId: string, reservationId: string) {
    // Vérifier que la réservation existe et appartient au client
    const reservation =
      await this.reservationsRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Réservation non trouvée',
      });
    }

    if (reservation.client_id !== clientId) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        message: "Vous n'avez pas accès à cette réservation",
      });
    }

    const payments =
      await this.paymentsRepository.findByReservationId(reservationId);

    return {
      success: true,
      data: payments,
    };
  }
}
