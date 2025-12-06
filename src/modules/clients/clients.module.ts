import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository, PrismaService],
  exports: [ClientsService],
})
export class ClientsModule {}
