import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientAuthService } from './client-auth.service';
import { AuthRepository } from './auth.repository';
import { ClientRepository } from './client.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtClientStrategy } from './strategies/jwt-client.strategy';
import { PrismaService } from '../../database/prisma.service';

/**
 * Module d'authentification
 * Principe SOLID : Single Responsibility - Gère uniquement l'authentification
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): any => {
        const secret = configService.get<string>('JWT_SECRET') || 'default-secret';
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '24h');
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ClientAuthService,
    AuthRepository,
    ClientRepository,
    JwtStrategy,
    JwtClientStrategy,
    PrismaService,
  ],
  exports: [AuthService, ClientAuthService, JwtModule],
})
export class AuthModule {}

