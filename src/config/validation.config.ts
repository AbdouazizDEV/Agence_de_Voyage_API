import { registerAs } from '@nestjs/config';

/**
 * Configuration validation
 * Principe SOLID : Single Responsibility - Gère uniquement la config validation
 */
export default registerAs('validation', () => ({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  disableErrorMessages: process.env.NODE_ENV === 'production',
}));

