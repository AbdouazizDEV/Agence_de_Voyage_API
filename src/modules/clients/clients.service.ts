import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';

/**
 * Service pour la gestion des clients (Admin)
 */
@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async findAll(pagination: PaginationDto, filters?: any) {
    const result = await this.clientsRepository.findAll(pagination, filters);
    const totalPages = Math.ceil(result.total / (pagination.limit || 12));

    return {
      success: true,
      data: result.data.map(client => ({
        id: client.id,
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
        isActive: client.is_active,
        createdAt: client.created_at,
      })),
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 12,
        total: result.total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Client non trouvé',
      });
    }

    return {
      success: true,
      data: {
        id: client.id,
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
        isActive: client.is_active,
        createdAt: client.created_at,
      },
    };
  }

  async create(createDto: CreateClientDto) {
    // Vérifier si l'email existe déjà
    const existingByEmail = await this.clientsRepository.findByEmail(createDto.email);
    if (existingByEmail) {
      throw new ConflictException({
        code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        message: `Un client avec l'email "${createDto.email}" existe déjà`,
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await EncryptionUtil.hashPassword(createDto.password);

    try {
      const client = await this.clientsRepository.create({
        ...createDto,
        password: hashedPassword,
      });

      return {
        success: true,
        data: {
          id: client.id,
          email: client.email,
          firstName: client.first_name,
          lastName: client.last_name,
          phone: client.phone,
        },
        message: 'Client créé avec succès',
      };
    } catch (error: any) {
      // Gérer les erreurs de contrainte unique de Prisma
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'champ';
        throw new ConflictException({
          code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
          message: `Un client avec ce ${field} existe déjà`,
        });
      }
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateClientDto) {
    const existing = await this.clientsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Client non trouvé',
      });
    }

    // Hasher le mot de passe si fourni
    if (updateDto.password) {
      updateDto.password = await EncryptionUtil.hashPassword(updateDto.password);
    }

    const client = await this.clientsRepository.update(id, updateDto);

    return {
      success: true,
      data: {
        id: client.id,
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
      },
      message: 'Client mis à jour avec succès',
    };
  }

  async delete(id: string) {
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Client non trouvé',
      });
    }

    await this.clientsRepository.delete(id);

    return {
      success: true,
      message: 'Client supprimé avec succès',
    };
  }

  async toggleStatus(id: string) {
    const client = await this.clientsRepository.toggleStatus(id);

    return {
      success: true,
      data: {
        id: client.id,
        isActive: client.is_active,
      },
      message: 'Statut du client modifié',
    };
  }
}

