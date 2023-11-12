import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/common/entities/permission.entity';
import { User } from 'src/common/entities/user.entity';
import { LimitedUserTicket } from 'src/common/entities/limitedUserTicket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LimitedUserTicket, Permission])],
})
export class LimitedUserTicketModule {}
