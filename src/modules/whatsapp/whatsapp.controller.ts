import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { GenerateMessageDto } from './dto/generate-message.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('WhatsApp')
@Controller({ path: 'whatsapp', version: '1' })
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Public()
  @Post('generate-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Générer un lien WhatsApp',
    description:
      "Génère un lien WhatsApp pour contacter l'agence à propos d'une offre",
  })
  async generateLink(@Body() dto: GenerateMessageDto) {
    const link = await this.whatsappService.generateWhatsAppLink(dto);
    return {
      success: true,
      data: { link },
    };
  }
}
