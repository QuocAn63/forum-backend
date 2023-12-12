import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../common/entities/permission.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { LimitedUserTicketModule } from '../limitedUserTicket/limitedUserTicket.module';

@Module({
  imports: [
    forwardRef(() => LimitedUserTicketModule),
    TypeOrmModule.forFeature([Permission]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionModule, PermissionService],
})
export class PermissionModule {}
