import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../common/entities/permission.entity';
import { RolePermissions } from '../../common/entities/rolePermissions.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RolePermissions])],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
