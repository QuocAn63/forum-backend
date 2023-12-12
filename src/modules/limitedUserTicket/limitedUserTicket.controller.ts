import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Permissions } from '../permission/permission.decorator';
import { CreateLimitedUserTicketDto } from './dto/limitedUserTicket_create.dto';
import { LimitedUserTicketService } from './limitedUserTicket.service';

@UseGuards(AuthGuard, RoleGuard)
@Roles('ADMIN')
@Controller('limitedticket')
export class LimitedUserTicketController {
  constructor(private limitedTicketService: LimitedUserTicketService) {}

  @Post(':id')
  async createTicket(
    @Param('id') id: string,
    @Body() data: CreateLimitedUserTicketDto,
  ) {
    return this.limitedTicketService.createNewTicket(id, data);
  }
}
