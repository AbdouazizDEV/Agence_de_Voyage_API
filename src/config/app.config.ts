import { registerAs } from '@nestjs/config';

/**
 * Configuration de l'application
 * Principe SOLID : Single Responsibility - Gère uniquement la config app
 */
export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Travel Agency API',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
