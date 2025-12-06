/**
 * Constantes applicatives centralisées
 * Principe SOLID : Single Responsibility - Centralise toutes les constantes
 */

export const APP_CONSTANTS = {
  APP_NAME: 'Travel Agency API',
  APP_VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 30000, // 30 secondes
} as const;

export const CATEGORIES = {
  VOL: 'vol',
  HOTEL: 'hotel',
  SEJOUR: 'sejour',
  PACKAGE: 'package',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate',
  HARD: 'hard',
} as const;

