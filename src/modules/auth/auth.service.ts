import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';
import { Admin } from './entities/admin.entity';

/**
 * Service d'authentification
 * Principe SOLID : Single Responsibility - Gère uniquement la logique d'authentification
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Vérifier si l'email existe déjà
    const existingAdmin = await this.authRepository.findByEmail(registerDto.email);
    
    if (existingAdmin) {
      throw new ConflictException({
        code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        message: 'Un administrateur avec cet email existe déjà',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await EncryptionUtil.hashPassword(registerDto.password);

    // Créer l'admin
    const admin = await this.authRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
      role: registerDto.role || 'admin',
    });

    // Générer les tokens
    const tokens = await this.generateTokens(admin);

    return {
      ...tokens,
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const admin = await this.authRepository.findByEmail(loginDto.email);

    if (!admin) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const isPasswordValid = await EncryptionUtil.comparePassword(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const tokens = await this.generateTokens(admin);

    return {
      ...tokens,
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const admin = await this.authRepository.findByEmail(email);

    if (!admin) {
      return null;
    }

    const isPasswordValid = await EncryptionUtil.comparePassword(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = admin;
    return result;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 
                            this.configService.get<string>('JWT_SECRET') || 
                            'default-refresh-secret';
      
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      }) as ITokenPayload & { type?: string };

      if (payload.type && payload.type !== 'admin') {
        throw new UnauthorizedException({
          code: ERROR_CODES.TOKEN_INVALID,
          message: 'Token invalide pour un administrateur',
        });
      }

      const admin = await this.authRepository.findById(payload.sub);

      if (!admin || !admin.is_active) {
        throw new UnauthorizedException({
          code: ERROR_CODES.TOKEN_INVALID,
          message: 'Administrateur non trouvé ou inactif',
        });
      }

      const tokens = await this.generateTokens(admin);

      return {
        ...tokens,
        user: {
          id: admin.id,
          email: admin.email,
          firstName: admin.first_name,
          lastName: admin.last_name,
          role: admin.role,
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

  private async generateTokens(admin: Admin): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: ITokenPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin',
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

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

  async getProfile(adminId: string) {
    const admin = await this.authRepository.findById(adminId);

    if (!admin) {
      throw new UnauthorizedException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Administrateur non trouvé',
      });
    }

    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
        createdAt: admin.created_at,
      },
    };
  }

  async logout() {
    // Pour l'instant, on retourne juste un succès
    // Dans une implémentation complète, on pourrait blacklister le token
    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  }
}

