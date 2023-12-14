import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService extends BaseService<
  Permission,
  Repository<Permission>
> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {
    super(permissionRepo);
  }

  async getListOfActivePermissions(permissions: string[]) {
    const result = await this.repository.find({
      where: {
        id: In(permissions),
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return result.map((permission) => permission.id);
  }
}
