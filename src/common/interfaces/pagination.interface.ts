/**
 * Interface pour la pagination
 * Principe SOLID : Interface Segregation - Interface claire et minimale
 */
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
