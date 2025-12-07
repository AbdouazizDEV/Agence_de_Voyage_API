import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client } from './entities/client.entity';

/**
 * Repository pour les opérations sur les clients
 * Principe SOLID : Single Responsibility - Gère uniquement l'accès aux données clients
 */
@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findFirst({
      where: {
        email,
        is_active: true,
      },
    });

    return client as Client | null;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    return client as Client | null;
  }

  async create(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<Client> {
    const client = await this.prisma.client.create({
      data: {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
    });

    return client as Client;
  }
}
