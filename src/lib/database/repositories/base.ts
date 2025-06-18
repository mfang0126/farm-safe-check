import type { 
  DatabaseResponse, 
  DatabaseListResponse, 
  QueryOptions,
  BaseFilter
} from '../types';

/**
 * Base repository interface providing common CRUD operations
 * This is a template for future repository implementations
 */
export interface IBaseRepository<T, TInsert, TUpdate> {
  findById(id: string): Promise<DatabaseResponse<T>>;
  findAll(filter?: BaseFilter, options?: QueryOptions): Promise<DatabaseListResponse<T>>;
  create(data: TInsert): Promise<DatabaseResponse<T>>;
  update(id: string, data: TUpdate): Promise<DatabaseResponse<T>>;
  delete(id: string): Promise<DatabaseResponse<boolean>>;
  count(filter?: BaseFilter): Promise<DatabaseResponse<number>>;
} 