import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { GenerateMessageDto } from './dto/generate-message.dto';

/**
 * Service WhatsApp
 * Principe SOLID : Single Responsibility - Gère uniquement WhatsApp
 */
@Injectable()
export class WhatsAppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateWhatsAppLink(dto: GenerateMessageDto): Promise<string> {
    const phoneNumber = this.configService.get<string>('WHATSAPP_PHONE_NUMBER', '221761885485');
    const template = this.configService.get<string>(
      'WHATSAPP_MESSAGE_TEMPLATE',
      'Bonjour, je suis intéressé(e) par...',
    );

    // Récupérer l'offre
    const offer = await this.prisma.offer.findUnique({
      where: { id: dto.offerId },
      select: { title: true, destination: true, price: true },
    });

    const message = dto.customMessage || 
      `${template} ${offer?.title || ''} - ${offer?.destination || ''}`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Générer le lien WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Logger la demande
    await this.prisma.whatsAppLog.create({
      data: {
        offer_id: dto.offerId,
        customer_phone: dto.phone,
        customer_name: dto.customerName,
        message,
        type: 'offer_inquiry',
        status: 'pending',
      },
    });

    return whatsappLink;
  }
}

