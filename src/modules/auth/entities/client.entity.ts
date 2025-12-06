/**
 * Entité Client
 * Principe SOLID : Single Responsibility - Représente uniquement l'entité Client
 */
export interface Client {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

