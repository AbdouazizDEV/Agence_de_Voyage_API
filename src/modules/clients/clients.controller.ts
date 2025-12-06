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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';

/**
 * Contrôleur Clients Admin
 */
@ApiTags('Clients Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller({ path: 'admin/clients', version: '1' })
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liste des clients', description: 'Récupère tous les clients avec pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 12 })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par email, nom, prénom' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() pagination: PaginationDto, @Query('search') search?: string, @Query('isActive') isActive?: boolean) {
    return this.clientsService.findAll(pagination, { search, isActive });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Détails d\'un client' })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un client' })
  async create(@Body() createDto: CreateClientDto) {
    return this.clientsService.create(createDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour un client' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateClientDto) {
    return this.clientsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un client' })
  async delete(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activer/Désactiver un client' })
  async toggleStatus(@Param('id') id: string) {
    return this.clientsService.toggleStatus(id);
  }
}

