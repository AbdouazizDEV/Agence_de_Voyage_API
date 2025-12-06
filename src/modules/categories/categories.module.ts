import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesAdminController } from './categories-admin.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService, CategoriesRepository, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

