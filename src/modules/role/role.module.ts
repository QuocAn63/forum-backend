import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../common/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [],
})
export class RoleModule {}
