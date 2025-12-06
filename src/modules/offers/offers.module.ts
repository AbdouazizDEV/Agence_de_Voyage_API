import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersAdminController } from './offers-admin.controller';
import { OffersService } from './offers.service';
import { OffersRepository } from './offers.repository';
import { PrismaService } from '../../database/prisma.service';
import { SupabaseStorageService } from '../../database/supabase-storage.service';
import { UploadModule } from '../upload/upload.module';

/**
 * Module Offres
 * Principe SOLID : Single Responsibility - Gère uniquement les offres
 */
@Module({
  imports: [UploadModule],
  controllers: [OffersController, OffersAdminController],
  providers: [OffersService, OffersRepository, PrismaService, SupabaseStorageService],
  exports: [OffersService],
})
export class OffersModule {}

