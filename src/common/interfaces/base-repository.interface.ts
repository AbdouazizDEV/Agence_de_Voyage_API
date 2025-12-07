/**
 * Interface Repository Pattern - Abstraction des opérations CRUD
 * Principe SOLID : Dependency Inversion - Les modules dépendent d'abstractions
 */
export interface IBaseRepository<T> {
  findAll(filters?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
