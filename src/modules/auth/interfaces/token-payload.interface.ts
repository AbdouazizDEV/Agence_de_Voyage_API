/**
 * Interface pour le payload du token JWT
 * Principe SOLID : Interface Segregation - Interface claire et minimale
 */
export interface ITokenPayload {
  sub: string; // user id
  email: string;
  role?: string; // Pour les admins
  type?: 'admin' | 'client'; // Type d'utilisateur
}

