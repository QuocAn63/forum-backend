import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from './role.decorator';
import { RoleUpdatePermissionDto } from './dto/role_updatePermission.dto';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async getListOfRole() {
    return this.roleService.index();
  }

  @Post('updatepermissions')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async updateRolePermissions(
    @Body()
    roleUpdatePermissionDto: RoleUpdatePermissionDto,
  ) {
    return await this.roleService.updateRolePermissions(
      roleUpdatePermissionDto,
    );
  }
}
