import { registerAs } from '@nestjs/config';

/**
 * Configuration JWT
 * Principe SOLID : Single Responsibility - Gère uniquement la config JWT
 */
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
