import { DeleteResult, UpdateResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export interface IBaseService<T> {
  index(page: number, size: number): Promise<T[]>;

  store(data: any): Promise<T>;

  update(id: EntityId, data: any): Promise<UpdateResult>;

  delete(id: EntityId): Promise<DeleteResult>;
}
