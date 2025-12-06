import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Strategy JWT pour les clients
 * Principe SOLID : Single Responsibility - Gère uniquement la validation JWT client
 */
@Injectable()
export class JwtClientStrategy extends PassportStrategy(Strategy, 'jwt-client') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token invalide');
    }

    // Vérifier que c'est un token client
    if (payload.type && payload.type !== 'client') {
      throw new UnauthorizedException('Token invalide pour un client');
    }

    return {
      id: payload.sub,
      email: payload.email,
      type: 'client',
    };
  }
}

