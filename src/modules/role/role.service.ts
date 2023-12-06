import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/entities/role.entity';
import { BaseService } from 'src/interfaces/base.service';
import { In, Repository } from 'typeorm';
import { PermissionService } from '../permission/permission.service';
import { RoleUpdatePermissionDto } from './dto/role_updatePermission.dto';

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
      )
        .map((permission) => permission.id)
        .join(',');

      const result = await this.repository.update(
        { id: role.id },
        { permissions: activePermissions },
      );
      results = { ...results, id: role.id, updates: result.raw.permissions };
      console.log(results);
    });

    return results;
  }
}
