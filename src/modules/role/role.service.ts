import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { In, Repository } from 'typeorm';
import { PermissionService } from '../permission/permission.service';
import { RoleUpdatePermissionDto } from './dto/role_updatePermission.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService extends BaseService<Role, Repository<Role>> {
  constructor(
    @InjectRepository(Role) roleRepository: Repository<Role>,
    private permissionService: PermissionService,
  ) {
    super(roleRepository);
  }

  async updateRolePermissions(
    roleUpdatePermissionDto: RoleUpdatePermissionDto,
  ): Promise<any> {
    const roles = roleUpdatePermissionDto.roles?.length
      ? await this.repository.find({
          where: { id: In(roleUpdatePermissionDto.roles) },
        })
      : await this.repository.find();
    let results = {};

    roles.forEach(async (role) => {
      const permissions = roleUpdatePermissionDto.permissions;

      const activePermissions = (
        await this.permissionService.getListOfActivePermissions(permissions)
      ).join(',');

      const result = await this.repository.update(
        { id: role.id },
        { permissions: activePermissions },
      );
      results = { ...results, id: role.id, updates: result.raw.permissions };
    });

    return results;
  }
}
