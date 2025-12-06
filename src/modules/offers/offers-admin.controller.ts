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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des offres (Admin)',
    description: 'Récupère toutes les offres avec pagination et filtres (Admin)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 12 })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche textuelle' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() pagination: PaginationDto, @Query('search') search?: string, @Query('category') category?: string, @Query('isActive') isActive?: boolean) {
    return this.offersService.findAll(pagination, { search, category, isActive });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Créer une nouvelle offre',
    description: 'Créer une nouvelle offre de voyage avec upload d\'images (Admin uniquement)',
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

    return this.offersService.create(parsedData as CreateOfferDto, images);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Mettre à jour une offre',
    description: 'Mettre à jour une offre existante avec upload d\'images optionnel (Admin uniquement)',
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
          description: 'Action pour les images: "add" (ajouter aux existantes) ou "replace" (remplacer toutes). Par défaut: "add"',
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
      parsedData.price = typeof updateDto.price === 'string' ? parseFloat(updateDto.price) : updateDto.price;
    }
    if (updateDto.duration !== undefined) {
      parsedData.duration = typeof updateDto.duration === 'string' ? parseInt(updateDto.duration, 10) : updateDto.duration;
    }
    if (updateDto.promotion_discount !== undefined) {
      parsedData.promotion_discount = typeof updateDto.promotion_discount === 'string' 
        ? parseFloat(updateDto.promotion_discount) 
        : updateDto.promotion_discount;
    }
    if (updateDto.available_seats !== undefined) {
      parsedData.available_seats = typeof updateDto.available_seats === 'string' 
        ? parseInt(updateDto.available_seats, 10) 
        : updateDto.available_seats;
    }
    if (updateDto.max_capacity !== undefined) {
      parsedData.max_capacity = typeof updateDto.max_capacity === 'string' 
        ? parseInt(updateDto.max_capacity, 10) 
        : updateDto.max_capacity;
    }

    // Convertir les booléens
    if (updateDto.is_active !== undefined) {
      parsedData.is_active = typeof updateDto.is_active === 'string' 
        ? updateDto.is_active === 'true' || updateDto.is_active === '1' 
        : updateDto.is_active;
    }
    if (updateDto.is_promotion !== undefined) {
      parsedData.is_promotion = typeof updateDto.is_promotion === 'string' 
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

    // Extraire images_action pour le passer au service
    const imagesAction = (parsedData.images_action || 'add') as 'add' | 'replace';
    delete parsedData.images_action;

    return this.offersService.update(id, parsedData as UpdateOfferDto, images, imagesAction);
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
    description: 'Basculer le statut actif/inactif d\'une offre',
  })
  async toggleStatus(@Param('id') id: string) {
    return this.offersService.toggleStatus(id);
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Dupliquer une offre',
    description: 'Créer une copie d\'une offre existante',
  })
  async duplicate(@Param('id') id: string) {
    return this.offersService.duplicate(id);
  }
}

