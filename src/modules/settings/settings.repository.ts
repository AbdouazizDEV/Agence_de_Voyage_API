import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

/**
 * Repository pour les paramètres
 * Pour l'instant, on utilise une table simple ou on peut stocker en JSON
 */
@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<any> {
    // Pour l'instant, on retourne des valeurs par défaut
    // Plus tard, on peut créer une table settings
    return {
      company: {
        name: 'Travel Agency Dakar',
        email: 'contact@travelagency.sn',
        phone: '221761885485',
        whatsappNumber: '221761885485',
        address: 'Dakar, Sénégal',
        description: 'Votre agence de voyage de confiance',
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '221761885485',
        messageTemplate: 'Bonjour, je suis intéressé(e) par...',
      },
      general: {
        currency: 'FCFA',
        timezone: 'Africa/Dakar',
        language: 'fr',
      },
    };
  }

  async updateSettings(updateDto: UpdateSettingsDto): Promise<any> {
    // Pour l'instant, on retourne les valeurs mises à jour
    // Plus tard, on peut créer une table settings et sauvegarder
    const current = await this.getSettings();

    return {
      company: {
        ...current.company,
        ...(updateDto.companyName && { name: updateDto.companyName }),
        ...(updateDto.companyEmail && { email: updateDto.companyEmail }),
        ...(updateDto.companyPhone && { phone: updateDto.companyPhone }),
        ...(updateDto.address && { address: updateDto.address }),
        ...(updateDto.description && { description: updateDto.description }),
        ...(updateDto.whatsappNumber && {
          whatsappNumber: updateDto.whatsappNumber,
        }),
      },
      whatsapp: {
        ...current.whatsapp,
        ...(updateDto.whatsappNumber && {
          phoneNumber: updateDto.whatsappNumber,
        }),
        ...(updateDto.whatsappMessageTemplate && {
          messageTemplate: updateDto.whatsappMessageTemplate,
        }),
        ...(updateDto.whatsappEnabled !== undefined && {
          enabled: updateDto.whatsappEnabled,
        }),
      },
      general: {
        ...current.general,
        ...(updateDto.currency && { currency: updateDto.currency }),
      },
    };
  }
}
