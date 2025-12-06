import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client } from '../auth/entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

/**
 * Repository pour les clients (Admin)
 */
@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto, filters?: any): Promise<{ data: Client[]; total: number }> {
    const { page = 1, limit = 12 } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {
      ...(filters?.search && {
        OR: [
          { email: { contains: filters.search, mode: 'insensitive' } },
          { first_name: { contains: filters.search, mode: 'insensitive' } },
          { last_name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters?.isActive !== undefined && { is_active: filters.isActive }),
    };

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: data as Client[],
      total,
    };
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    return client as Client | null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findFirst({
      where: { email },
    });

    return client as Client | null;
  }

  async create(createDto: CreateClientDto): Promise<Client> {
    const client = await this.prisma.client.create({
      data: {
        email: createDto.email,
        password: createDto.password, // Devrait être hashé dans le service
        first_name: createDto.firstName,
        last_name: createDto.lastName,
        phone: createDto.phone,
      },
    });

    return client as Client;
  }

  async update(id: string, updateDto: UpdateClientDto): Promise<Client> {
    const client = await this.prisma.client.update({
      where: { id },
      data: {
        ...(updateDto.email && { email: updateDto.email }),
        ...(updateDto.password && { password: updateDto.password }), // Devrait être hashé
        ...(updateDto.firstName && { first_name: updateDto.firstName }),
        ...(updateDto.lastName && { last_name: updateDto.lastName }),
        ...(updateDto.phone !== undefined && { phone: updateDto.phone }),
      },
    });

    return client as Client;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.client.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async toggleStatus(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new Error('Client non trouvé');
    }

    const updated = await this.prisma.client.update({
      where: { id },
      data: { is_active: !client.is_active },
    });

    return updated as Client;
  }
}

