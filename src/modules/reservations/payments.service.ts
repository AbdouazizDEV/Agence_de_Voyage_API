import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';

/**
 * Service pour la gestion des paiements
 * (Utilisé par le service de réservations)
 */
@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}
}
