import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionCreateDto } from './dto/permission_create.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async getListOfPermission() {
    return await this.permissionService.index();
  }

  @Post()
  async createPermission(@Body() createPermissionDto: PermissionCreateDto) {
    return await this.permissionService.store(createPermissionDto);
  }
}
