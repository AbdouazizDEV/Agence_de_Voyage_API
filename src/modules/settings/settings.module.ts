import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsAdminController } from './settings-admin.controller';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [SettingsController, SettingsAdminController],
  providers: [SettingsService, SettingsRepository, PrismaService],
  exports: [SettingsService],
})
export class SettingsModule {}
