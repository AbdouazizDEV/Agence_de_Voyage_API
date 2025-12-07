import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClientAuthService } from './client-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ClientAuthResponseDto } from './dto/client-auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtClientGuard } from '../../common/guards/jwt-client.guard';

/**
 * Contrôleur d'authentification
 * Principe SOLID : Single Responsibility - Gère uniquement les endpoints auth
 */
@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientAuthService: ClientAuthService,
  ) {}

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion administrateur',
    description: 'Authentifie un administrateur et retourne les tokens JWT',
  })
  @ApiStandardResponse(AuthResponseDto)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enregistrement administrateur',
    description: 'Crée un nouveau compte administrateur',
  })
  @ApiStandardResponse(AuthResponseDto)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rafraîchir le token',
    description: 'Génère un nouveau access token à partir du refresh token',
  })
  @ApiStandardResponse(AuthResponseDto)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Déconnexion',
    description: "Déconnecte l'utilisateur actuel",
  })
  async logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Profil administrateur',
    description:
      "Récupère les informations du profil de l'administrateur connecté",
  })
  async getAdminProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  // ========== ENDPOINTS CLIENTS ==========

  @Public()
  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enregistrement client',
    description: 'Crée un nouveau compte client',
  })
  @ApiStandardResponse(ClientAuthResponseDto)
  async clientRegister(
    @Body() registerDto: ClientRegisterDto,
  ): Promise<ClientAuthResponseDto> {
    return this.clientAuthService.register(registerDto);
  }

  @Public()
  @Post('client/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion client',
    description: 'Authentifie un client et retourne les tokens JWT',
  })
  @ApiStandardResponse(ClientAuthResponseDto)
  async clientLogin(
    @Body() loginDto: ClientLoginDto,
  ): Promise<ClientAuthResponseDto> {
    return this.clientAuthService.login(loginDto);
  }

  @Public()
  @Post('client/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rafraîchir le token client',
    description: 'Génère un nouveau access token à partir du refresh token',
  })
  @ApiStandardResponse(ClientAuthResponseDto)
  async clientRefresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ClientAuthResponseDto> {
    return this.clientAuthService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtClientGuard)
  @Get('client/profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Profil client',
    description: 'Récupère les informations du profil du client connecté',
  })
  async getClientProfile(@Request() req: any) {
    return this.clientAuthService.getProfile(req.user.id);
  }
}
