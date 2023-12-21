import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LimitedUserTicketService } from './limitedUserTicket.service';
import { PermissionModule } from '../permission/permission.module';
import { LimitedUserTicket } from './entities/limitedUserTicket.entity';
import { LimitedUserTicketController } from './limitedUserTicket.controller';

@Module({
  imports: [
    UserModule,
    forwardRef(() => PermissionModule),
    TypeOrmModule.forFeature([LimitedUserTicket]),
  ],
  controllers: [LimitedUserTicketController],
  providers: [LimitedUserTicketService],
  exports: [LimitedUserTicketService],
})
export class LimitedUserTicketModule {}
