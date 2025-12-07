import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Admin } from './entities/admin.entity';

/**
 * Repository pour les opérations sur les admins
 * Principe SOLID : Single Responsibility - Gère uniquement l'accès aux données
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
        is_active: true,
      },
    });

    return admin as Admin | null;
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    return admin as Admin | null;
  }

  async create(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }): Promise<Admin> {
    const admin = await this.prisma.admin.create({
      data: {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role || 'admin',
      },
    });

    return admin as Admin;
  }
}
