import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LimitedUserTicket } from 'src/common/entities/limitedUserTicket.entity';
import { UserModule } from '../user/user.module';
import { LimitedUserTicketService } from './limitedUserTicket.service';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => PermissionModule),
    TypeOrmModule.forFeature([LimitedUserTicket]),
  ],
  providers: [LimitedUserTicketService],
  exports: [LimitedUserTicketModule, LimitedUserTicketService],
})
export class LimitedUserTicketModule {}
