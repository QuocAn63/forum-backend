import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from './role.decorator';
import { RoleUpdatePermissionDto } from './dto/role_updatePermission.dto';
import { RolesEnum } from './role.constant';
import { RoleGuard } from './role.guard';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Roles')
@UseGuards(AuthGuard, RoleGuard)
@Roles(RolesEnum.ADMIN)
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get list of roles.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Get()
  async getListOfRole() {
    return this.roleService.index();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Role updated.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post('updatepermissions')
  async updateRolePermissions(
    @Body()
    roleUpdatePermissionDto: RoleUpdatePermissionDto,
  ) {
    return await this.roleService.updateRolePermissions(
      roleUpdatePermissionDto,
    );
  }
}
