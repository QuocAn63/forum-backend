import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../common/entities/permission.entity';
import { RolePermissions } from '../../common/entities/rolePermissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RolePermissions])],
})
export class PermissionModule {}
