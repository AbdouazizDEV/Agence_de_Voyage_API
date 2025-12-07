import { SetMetadata } from '@nestjs/common';

/**
 * Decorator pour marquer les routes publiques (sans authentification)
 * Principe SOLID : Single Responsibility - Gère uniquement les routes publiques
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
