import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateOfferFormDto } from './dto/create-offer-form.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { UpdateOfferFormDto } from './dto/update-offer-form.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminOffersQueryDto } from './dto/admin-offers-query.dto';

/**
 * Contrôleur Offres Admin - Routes administrateur
 * Principe SOLID : Single Responsibility - Gère uniquement les endpoints admin
 */
@ApiTags('Offers Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller({ path: 'admin/offers', version: '1' })
export class OffersAdminController {
  constructor(private readonly offersService: OffersService) {}

  /**
   * Normalise une date au format ISO-8601 complet pour Prisma
   * Convertit les formats partiels (ex: "2025-12-21T03:25") en format complet (ex: "2025-12-21T03:25:00.000Z")
   */
  private normalizeDate(
    dateString: string | undefined,
  ): string | undefined {
    if (!dateString) return undefined;

    // Si la date est déjà au format ISO complet, la retourner telle quelle
    if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
      // Vérifier si c'est déjà un format complet avec timezone
      try {
        new Date(dateString).toISOString();
        return dateString;
      } catch {
        // Continuer pour normaliser
      }
    }

    // Tenter de parser et reformater la date
    try {
      // Si la date n'a pas de timezone, ajouter 'Z' (UTC)
      let dateToParse = dateString;
      if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
        // Si la date est incomplète (ex: "2025-12-21T03:25"), compléter avec secondes et timezone
        if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
          dateToParse = dateString + ':00.000Z';
        } else if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
          dateToParse = dateString + '.000Z';
        } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          dateToParse = dateString + 'T00:00:00.000Z';
        } else {
          dateToParse = dateString + 'Z';
        }
      }

      const date = new Date(dateToParse);
      if (isNaN(date.getTime())) {
        return undefined; // Date invalide
      }
      return date.toISOString();
    } catch {
      return undefined;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des offres (Admin)',
    description:
      'Récupère toutes les offres avec pagination et filtres (Admin)',
  })
  @ApiStandardResponse(OfferResponseDto, true)
  async findAll(@Query() query: AdminOffersQueryDto) {
    const { page, limit, search, category, isActive } = query;
    return this.offersService.findAll(
      { page, limit },
      {
        search,
        category,
        isActive,
      },
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Créer une nouvelle offre',
    description:
      "Créer une nouvelle offre de voyage avec upload d'images (Admin uniquement)",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        destination: { type: 'string' },
        category: { type: 'string' },
        price: { type: 'number' },
        duration: { type: 'number' },
        description: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        itinerary: { type: 'string', description: 'JSON string' },
        included: { type: 'string', description: 'JSON string array' },
        excluded: { type: 'string', description: 'JSON string array' },
        is_active: { type: 'boolean' },
        is_promotion: { type: 'boolean' },
        promotion_discount: { type: 'number' },
        promotion_ends_at: { type: 'string', format: 'date-time' },
        max_capacity: { type: 'number' },
        departure_date: { type: 'string', format: 'date-time' },
        return_date: { type: 'string', format: 'date-time' },
        tags: { type: 'string', description: 'JSON string array' },
        difficulty: { type: 'string', enum: ['easy', 'moderate', 'hard'] },
      },
    },
  })
  @ApiStandardResponse(OfferResponseDto)
  async create(
    @Body() createDto: CreateOfferFormDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    // Parser les JSON strings
    const parsedData: any = { ...createDto };

    if (createDto.itinerary) {
      try {
        parsedData.itinerary = JSON.parse(createDto.itinerary);
      } catch {
        parsedData.itinerary = [];
      }
    }

    if (createDto.included) {
      try {
        parsedData.included = JSON.parse(createDto.included);
      } catch {
        parsedData.included = [];
      }
    }

    if (createDto.excluded) {
      try {
        parsedData.excluded = JSON.parse(createDto.excluded);
      } catch {
        parsedData.excluded = [];
      }
    }

    if (createDto.tags) {
      try {
        parsedData.tags = JSON.parse(createDto.tags);
      } catch {
        parsedData.tags = [];
      }
    }

    // Normaliser les dates au format ISO-8601 complet
    if (createDto.promotion_ends_at) {
      parsedData.promotion_ends_at = this.normalizeDate(createDto.promotion_ends_at);
    }
    if (createDto.departure_date) {
      parsedData.departure_date = this.normalizeDate(createDto.departure_date);
    }
    if (createDto.return_date) {
      parsedData.return_date = this.normalizeDate(createDto.return_date);
    }

    return this.offersService.create(parsedData as CreateOfferDto, images);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Mettre à jour une offre',
    description:
      "Mettre à jour une offre existante avec upload d'images optionnel (Admin uniquement)",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        destination: { type: 'string' },
        category: { type: 'string' },
        price: { type: 'number' },
        duration: { type: 'number' },
        description: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        images_action: {
          type: 'string',
          enum: ['add', 'replace'],
          description:
            'Action pour les images: "add" (ajouter aux existantes) ou "replace" (remplacer toutes). Par défaut: "add"',
          default: 'add',
        },
        itinerary: { type: 'string', description: 'JSON string' },
        included: { type: 'string', description: 'JSON string array' },
        excluded: { type: 'string', description: 'JSON string array' },
        is_active: { type: 'boolean' },
        is_promotion: { type: 'boolean' },
        promotion_discount: { type: 'number' },
        promotion_ends_at: { type: 'string', format: 'date-time' },
        available_seats: { type: 'number' },
        max_capacity: { type: 'number' },
        departure_date: { type: 'string', format: 'date-time' },
        return_date: { type: 'string', format: 'date-time' },
        tags: { type: 'string', description: 'JSON string array' },
        difficulty: { type: 'string', enum: ['easy', 'moderate', 'hard'] },
      },
    },
  })
  @ApiStandardResponse(OfferResponseDto)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOfferFormDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    // Transformer les types FormData (tout arrive en string)
    const parsedData: any = { ...updateDto };

    // Convertir les nombres
    if (updateDto.price !== undefined) {
      parsedData.price =
        typeof updateDto.price === 'string'
          ? parseFloat(updateDto.price)
          : updateDto.price;
    }
    if (updateDto.duration !== undefined) {
      parsedData.duration =
        typeof updateDto.duration === 'string'
          ? parseInt(updateDto.duration, 10)
          : updateDto.duration;
    }
    if (updateDto.promotion_discount !== undefined) {
      parsedData.promotion_discount =
        typeof updateDto.promotion_discount === 'string'
          ? parseFloat(updateDto.promotion_discount)
          : updateDto.promotion_discount;
    }
    if (updateDto.available_seats !== undefined) {
      parsedData.available_seats =
        typeof updateDto.available_seats === 'string'
          ? parseInt(updateDto.available_seats, 10)
          : updateDto.available_seats;
    }
    if (updateDto.max_capacity !== undefined) {
      parsedData.max_capacity =
        typeof updateDto.max_capacity === 'string'
          ? parseInt(updateDto.max_capacity, 10)
          : updateDto.max_capacity;
    }

    // Convertir les booléens
    if (updateDto.is_active !== undefined) {
      parsedData.is_active =
        typeof updateDto.is_active === 'string'
          ? updateDto.is_active === 'true' || updateDto.is_active === '1'
          : updateDto.is_active;
    }
    if (updateDto.is_promotion !== undefined) {
      parsedData.is_promotion =
        typeof updateDto.is_promotion === 'string'
          ? updateDto.is_promotion === 'true' || updateDto.is_promotion === '1'
          : updateDto.is_promotion;
    }

    // Parser les JSON strings
    if (updateDto.itinerary) {
      try {
        parsedData.itinerary = JSON.parse(updateDto.itinerary);
      } catch {
        // Garder l'ancien itinéraire si le parsing échoue
        delete parsedData.itinerary;
      }
    }

    if (updateDto.included) {
      try {
        parsedData.included = JSON.parse(updateDto.included);
      } catch {
        delete parsedData.included;
      }
    }

    if (updateDto.excluded) {
      try {
        parsedData.excluded = JSON.parse(updateDto.excluded);
      } catch {
        delete parsedData.excluded;
      }
    }

    if (updateDto.tags) {
      try {
        parsedData.tags = JSON.parse(updateDto.tags);
      } catch {
        delete parsedData.tags;
      }
    }

    // Normaliser les dates au format ISO-8601 complet
    if (updateDto.promotion_ends_at) {
      parsedData.promotion_ends_at = this.normalizeDate(updateDto.promotion_ends_at);
    }
    if (updateDto.departure_date) {
      parsedData.departure_date = this.normalizeDate(updateDto.departure_date);
    }
    if (updateDto.return_date) {
      parsedData.return_date = this.normalizeDate(updateDto.return_date);
    }

    // Extraire images_action pour le passer au service
    const imagesAction = (parsedData.images_action || 'add') as
      | 'add'
      | 'replace';
    delete parsedData.images_action;

    return this.offersService.update(
      id,
      parsedData as UpdateOfferDto,
      images,
      imagesAction,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer une offre',
    description: 'Supprimer une offre (Admin uniquement)',
  })
  async delete(@Param('id') id: string) {
    return this.offersService.delete(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activer/Désactiver une offre',
    description: "Basculer le statut actif/inactif d'une offre",
  })
  async toggleStatus(@Param('id') id: string) {
    return this.offersService.toggleStatus(id);
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Dupliquer une offre',
    description: "Créer une copie d'une offre existante",
  })
  async duplicate(@Param('id') id: string) {
    return this.offersService.duplicate(id);
  }
}
