import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LimitedUserTicketService } from './limitedUserTicket.service';
import { PermissionModule } from '../permission/permission.module';
import { LimitedUserTicket } from './entities/limitedUserTicket.entity';

@Module({
  imports: [
    UserModule,
    forwardRef(() => PermissionModule),
    TypeOrmModule.forFeature([LimitedUserTicket]),
  ],
  providers: [LimitedUserTicketService],
  exports: [LimitedUserTicketService],
})
export class LimitedUserTicketModule {}
