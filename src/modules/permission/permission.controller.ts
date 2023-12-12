import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionCreateDto } from './dto/permission_create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { CreateLimitedUserTicketDto } from '../limitedUserTicket/dto/limitedUserTicket_create.dto';
import { LimitedUserTicketService } from '../limitedUserTicket/limitedUserTicket.service';

@UseGuards(AuthGuard, RoleGuard)
@Roles('ADMIN')
@Controller('permissions')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private limitedTicketService: LimitedUserTicketService,
  ) {}

  @Get()
  async getListOfPermission() {
    return await this.permissionService.index();
  }

  @Post()
  async createPermission(@Body() createPermissionDto: PermissionCreateDto) {
    return await this.permissionService.store(createPermissionDto);
  }

  @Post('limit/:id')
  async createTicket(
    @Param('id') id: string,
    @Body() data: CreateLimitedUserTicketDto,
  ) {
    return this.limitedTicketService.createNewTicket(id, data);
  }
}
