import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * Contrôleur Settings Admin
 */
@ApiTags('Settings Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller({ path: 'admin/settings', version: '1' })
export class SettingsAdminController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer la configuration (Admin)' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour la configuration' })
  async updateSettings(@Body() updateDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateDto);
  }
}

