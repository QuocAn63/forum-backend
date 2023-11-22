import { BaseEntity, DeleteResult, Repository, UpdateResult } from "typeorm";
import { IBaseService } from "./i.base.service";
import { EntityId } from "typeorm/repository/EntityId";

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T>{
    constructor(protected repository: R){}
    
    index(): Promise<T[]> {
        return this.repository.find()
    }

    async store(data: any): Promise<T> {
        return await this.repository.save(data)
    }

    async update(id: EntityId, data: any): Promise<UpdateResult> {
        return (await this.repository.update(id, data))
    }

    async delete(id: EntityId): Promise<DeleteResult> {
        return  await this.repository.delete(id)
    }

}