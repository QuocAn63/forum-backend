import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../common/entities/role.entity';
import { RolePermissions } from '../../common/entities/rolePermissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermissions])],
  exports: [],
})
export class RoleModule {}
