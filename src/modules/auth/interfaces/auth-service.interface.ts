import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

/**
 * Interface pour le service d'authentification
 * Principe SOLID : Interface Segregation - Séparation des responsabilités
 */
export interface IAuthService {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  validateUser(email: string, password: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<AuthResponseDto>;
}

