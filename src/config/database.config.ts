import { registerAs } from '@nestjs/config';

/**
 * Configuration Supabase
 * Principe SOLID : Single Responsibility - Gère uniquement la config DB
 */
export default registerAs('database', () => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
}));
