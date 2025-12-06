import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '../interfaces/token-payload.interface';

/**
 * Strategy JWT pour Passport
 * Principe SOLID : Single Responsibility - Gère uniquement la validation JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: ITokenPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token invalide');
    }

    // Vérifier que c'est un token admin
    if (payload.type && payload.type !== 'admin') {
      throw new UnauthorizedException('Token invalide pour un administrateur');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      type: 'admin',
    };
  }
}

