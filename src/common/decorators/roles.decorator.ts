import { SetMetadata } from '@nestjs/common';

/**
 * Decorator pour RBAC (Role-Based Access Control)
 * Principe SOLID : Single Responsibility - Gère uniquement les rôles
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
