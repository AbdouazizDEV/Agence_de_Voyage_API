import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

// Modules métier
import { AuthModule } from './modules/auth/auth.module';
import { OffersModule } from './modules/offers/offers.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadModule } from './modules/upload/upload.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ClientsModule } from './modules/clients/clients.module';

/**
 * Module racine de l'application
 * Principe SOLID : Single Responsibility - Configure l'application globale
 */
@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),

    // Modules métier
    AuthModule,
    OffersModule,
    WhatsAppModule,
    CategoriesModule,
    DashboardModule,
    UploadModule,
    SettingsModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // Guard global retiré - chaque route utilise son guard spécifique
    // Les routes publiques utilisent @Public()
    // Les routes admin utilisent @UseGuards(JwtAuthGuard)
    // Les routes client utilisent @UseGuards(JwtClientGuard)
  ],
})
export class AppModule {}
