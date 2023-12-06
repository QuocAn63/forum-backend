import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Permission } from 'src/common/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/interfaces/base.service';

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
    return this.repository.find({
      where: {
        id: In(permissions),
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  }
}
