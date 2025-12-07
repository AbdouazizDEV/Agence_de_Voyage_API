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
    summary: 'Liste des offres de voyage avec filtres',
    description: `
      Récupère toutes les offres disponibles avec pagination et filtres avancés.
      
      **Filtres disponibles:**
      - search: Recherche textuelle générale (cherche dans titre, description, destination). Supporte les débuts de mots et lettres.
      - category: Nom de la catégorie (ex: "Vols", "Hôtels", "Séjours", etc.)
      - destination: Recherche par destination
      - minPrice / maxPrice: Fourchette de prix
      - minDuration / maxDuration: Durée en jours
      - minRating: Note minimum (0-5)
      - difficulty: Niveau de difficulté (easy, moderate, hard)
      - tags: Tags associés (array)
      - departureDate: Date de départ minimum (ISO 8601)
      - returnDate: Date de retour maximum (ISO 8601)
      - travelers: Nombre de voyageurs
      - isPromotion: Uniquement les promotions (true/false)
      
      **Tri:**
      - sortBy: price, duration, rating, createdAt, bookings, views
      - sortOrder: asc, desc
    `,
  })
  @ApiStandardResponse(OfferResponseDto, true)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Recherche textuelle (titre, description, destination). Supporte les débuts de mots.',
  })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'destination', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'minDuration', required: false, type: Number })
  @ApiQuery({ name: 'maxDuration', required: false, type: Number })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['easy', 'moderate', 'hard'],
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Tags séparés par virgule (ex: "plage,romantique")',
  })
  @ApiQuery({ name: 'departureDate', required: false, type: String })
  @ApiQuery({ name: 'returnDate', required: false, type: String })
  @ApiQuery({ name: 'travelers', required: false, type: Number })
  @ApiQuery({ name: 'isPromotion', required: false, type: Boolean })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'duration', 'rating', 'createdAt', 'bookings', 'views'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query() query: any) {
    // Extraire la pagination
    const pagination: PaginationDto = {
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 12,
    };

    // Construire les filtres
    const filters: any = {
      ...(query.search && { search: query.search }),
      ...(query.category && { category: query.category }),
      ...(query.destination && { destination: query.destination }),
      ...(query.minPrice && { minPrice: parseFloat(query.minPrice) }),
      ...(query.maxPrice && { maxPrice: parseFloat(query.maxPrice) }),
      ...(query.minDuration && { minDuration: parseInt(query.minDuration) }),
      ...(query.maxDuration && { maxDuration: parseInt(query.maxDuration) }),
      ...(query.minRating && { minRating: parseFloat(query.minRating) }),
      ...(query.difficulty && { difficulty: query.difficulty }),
      ...(query.tags && {
        tags: query.tags.split(',').map((t: string) => t.trim()),
      }),
      ...(query.departureDate && { departureDate: query.departureDate }),
      ...(query.returnDate && { returnDate: query.returnDate }),
      ...(query.travelers && { travelers: parseInt(query.travelers) }),
      ...(query.isPromotion !== undefined && {
        isPromotion: query.isPromotion === 'true',
      }),
      ...(query.sortBy && { sortBy: query.sortBy }),
      ...(query.sortOrder && { sortOrder: query.sortOrder }),
    };

    // Si des filtres avancés sont présents, utiliser la recherche
    const hasAdvancedFilters = Object.keys(filters).length > 0;

    if (hasAdvancedFilters) {
      return this.offersService.search({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
    }

    // Sinon, utiliser la méthode findAll standard
    return this.offersService.findAll(pagination, filters);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Détails d'une offre",
    description: "Récupère les détails complets d'une offre par son ID",
  })
  @ApiStandardResponse(OfferResponseDto)
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Public()
  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Recherche avancée d'offres",
    description: `
      Effectue une recherche avancée avec plusieurs critères combinables:
      
      **Critères de recherche:**
      - search: Recherche textuelle générale (cherche dans titre, description, destination). Supporte les débuts de mots et lettres.
      - destination: Recherche par destination (recherche partielle)
      - category: Nom de la catégorie exacte
      - minPrice / maxPrice: Fourchette de prix
      - minDuration / maxDuration: Durée en jours
      - minRating: Note minimum (0-5)
      - difficulty: Niveau de difficulté (easy, moderate, hard)
      - tags: Array de tags (les offres doivent avoir tous ces tags)
      - departureDate: Date de départ minimum (ISO 8601)
      - returnDate: Date de retour maximum (ISO 8601)
      - travelers: Nombre de voyageurs (vérifie les places disponibles)
      - isPromotion: Uniquement les promotions (true/false)
      
      **Tri et pagination:**
      - sortBy: price, duration, rating, createdAt, bookings, views
      - sortOrder: asc, desc
      - page: Numéro de page (défaut: 1)
      - limit: Nombre de résultats par page (défaut: 12, max: 100)
      
      **Exemple de requête:**
      \`\`\`json
      {
        "destination": "Paris",
        "category": "Séjours",
        "minPrice": 100000,
        "maxPrice": 500000,
        "minDuration": 3,
        "maxDuration": 7,
        "minRating": 4.0,
        "difficulty": "easy",
        "tags": ["romantique", "culture"],
        "travelers": 2,
        "isPromotion": true,
        "sortBy": "price",
        "sortOrder": "asc",
        "page": 1,
        "limit": 12
      }
      \`\`\`
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

  @Public()
  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Suggestions d'offres",
    description: `
      Récupère des suggestions d'offres basées sur différents critères.
      Retourne des offres populaires, en promotion, et récentes.
    `,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 6,
    description: 'Nombre de suggestions (défaut: 6)',
  })
  @ApiStandardResponse(OfferResponseDto, true)
  async suggestions(@Query('limit') limit?: number) {
    return this.offersService.getSuggestions(limit || 6);
  }
}
