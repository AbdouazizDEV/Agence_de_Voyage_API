import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientRepository } from './client.repository';
import { ClientRegisterDto } from './dto/client-register.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { ClientAuthResponseDto } from './dto/client-auth-response.dto';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';
import { Client } from './entities/client.entity';

/**
 * Service d'authentification client
 * Principe SOLID : Single Responsibility - Gère uniquement la logique d'authentification client
 */
@Injectable()
export class ClientAuthService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: ClientRegisterDto,
  ): Promise<ClientAuthResponseDto> {
    // Vérifier si l'email existe déjà
    const existingClient = await this.clientRepository.findByEmail(
      registerDto.email,
    );

    if (existingClient) {
      throw new ConflictException({
        code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        message: 'Un client avec cet email existe déjà',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await EncryptionUtil.hashPassword(
      registerDto.password,
    );

    // Créer le client
    const client = await this.clientRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
      phone: registerDto.phone,
    });

    // Générer les tokens
    const tokens = await this.generateTokens(client);

    return {
      ...tokens,
      user: {
        id: client.id,
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
      },
    };
  }

  async login(loginDto: ClientLoginDto): Promise<ClientAuthResponseDto> {
    const client = await this.clientRepository.findByEmail(loginDto.email);

    if (!client) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const isPasswordValid = await EncryptionUtil.comparePassword(
      loginDto.password,
      client.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const tokens = await this.generateTokens(client);

    return {
      ...tokens,
      user: {
        id: client.id,
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<ClientAuthResponseDto> {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        this.configService.get<string>('JWT_SECRET') ||
        'default-refresh-secret';

      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      }) as { sub: string; email: string; type?: string };

      if (payload.type && payload.type !== 'client') {
        throw new UnauthorizedException({
          code: ERROR_CODES.TOKEN_INVALID,
          message: 'Token invalide pour un client',
        });
      }

      const client = await this.clientRepository.findById(payload.sub);

      if (!client || !client.is_active) {
        throw new UnauthorizedException({
          code: ERROR_CODES.TOKEN_INVALID,
          message: 'Client non trouvé ou inactif',
        });
      }

      const tokens = await this.generateTokens(client);

      return {
        ...tokens,
        user: {
          id: client.id,
          email: client.email,
          firstName: client.first_name,
          lastName: client.last_name,
          phone: client.phone,
        },
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        code: ERROR_CODES.TOKEN_EXPIRED,
        message: error.message || 'Token expiré ou invalide',
      });
    }
  }

  async getProfile(clientId: string) {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      throw new UnauthorizedException({
        code: ERROR_CODES.UNAUTHORIZED,
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
        createdAt: client.created_at,
      },
    };
  }

  private async generateTokens(client: Client): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: client.id,
      email: client.email,
      type: 'client',
    };

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    const jwtExpiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '24h',
    );
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default-refresh-secret';
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      } as any),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      } as any),
    ]);

    return { accessToken, refreshToken };
  }
}
