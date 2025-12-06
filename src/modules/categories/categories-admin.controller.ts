import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';

/**
 * Contrôleur Catégories Admin
 */
@ApiTags('Categories Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller({ path: 'admin/categories', version: '1' })
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liste des catégories (Admin)', description: 'Récupère toutes les catégories, y compris inactives' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Inclure les catégories inactives' })
  async findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAll(includeInactive === true);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Détails d\'une catégorie' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une catégorie' })
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activer/Désactiver une catégorie' })
  async toggleStatus(@Param('id') id: string) {
    return this.categoriesService.toggleStatus(id);
  }
}

