import { PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';

/**
 * DTO pour mettre à jour une offre
 * Principe SOLID : Single Responsibility - Gère uniquement les données de mise à jour
 */
export class UpdateOfferDto extends PartialType(CreateOfferDto) {}

