/**
 * Entité Admin
 * Principe SOLID : Single Responsibility - Représente uniquement l'entité Admin
 */
export interface Admin {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
