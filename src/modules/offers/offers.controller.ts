import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { SearchOfferDto } from './dto/search-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';

/**
 * Contrôleur Offres - Routes publiques
 * Principe SOLID : Single Responsibility - Gère uniquement les endpoints publics
 */
@ApiTags('Offers')
@Controller({ path: 'offers', version: '1' })
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des offres de voyage',
    description: `
      Récupère toutes les offres disponibles avec pagination et filtres.
      
      **Filtres disponibles:**
      - category: vol, hotel, sejour, package
      - minPrice / maxPrice: fourchette de prix
      - destination: nom de la destination
      - isPromotion: uniquement les promotions
      
      **Tri:**
      - sortBy: price, duration, rating, createdAt
      - sortOrder: asc, desc
    `,
  })
  @ApiStandardResponse(OfferResponseDto, true)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 12 })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Nom de la catégorie (ex: "Vols", "Hôtels", "Croisières", etc.)' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  async findAll(@Query() pagination: PaginationDto) {
    return this.offersService.findAll(pagination);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Détails d\'une offre',
    description: 'Récupère les détails complets d\'une offre par son ID',
  })
  @ApiStandardResponse(OfferResponseDto)
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Public()
  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recherche avancée d\'offres',
    description: `
      Effectue une recherche avancée avec plusieurs critères:
      - Destination
      - Dates de voyage
      - Nombre de voyageurs
      - Budget (min/max)
      - Catégorie
      - Préférences additionnelles
    `,
  })
  @ApiStandardResponse(OfferResponseDto, true)
  async search(@Body() searchDto: SearchOfferDto) {
    return this.offersService.search(searchDto);
  }

  @Public()
  @Get('featured/promotions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Offres promotionnelles',
    description: 'Récupère uniquement les offres en promotion active',
  })
  @ApiStandardResponse(OfferResponseDto, true)
  async promotions() {
    return this.offersService.findPromotions();
  }

  @Public()
  @Get('featured/popular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Destinations populaires',
    description: 'Récupère les destinations les plus réservées',
  })
  @ApiStandardResponse(OfferResponseDto, true)
  async popular() {
    return this.offersService.findPopular();
  }
}

