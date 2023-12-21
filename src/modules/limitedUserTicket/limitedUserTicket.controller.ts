import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { CreateLimitedUserTicketDto } from './dto/limitedUserTicket_create.dto';
import { LimitedUserTicketService } from './limitedUserTicket.service';
import { RolesEnum } from '../role/role.constant';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../auth/user.decorator';
import { Paginate } from 'src/common/decorators/paginate.decorator';

@ApiTags('LimitedUserTickets')
@UseGuards(AuthGuard, RoleGuard)
@Roles(RolesEnum.ADMIN)
@Controller('limitedticket')
export class LimitedUserTicketController {
  constructor(private limitedTicketService: LimitedUserTicketService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return user tickets.' })
  @ApiForbiddenResponse({ description: 'User not allowed to access.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Get(':userId')
  async getTicketsOfUser(
    @User() user: AuthUser,
    @Param('userId') userId: string,
    @Paginate() paginate: any,
  ) {
    if (user.id !== userId) {
      throw new ForbiddenException('You are not allowed.');
    }

    return this.limitedTicketService.findTicketsOfUser(userId);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Ticket created.' })
  @ApiForbiddenResponse({ description: 'Authorization failed for user.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post(':id')
  async createTicket(
    @Param('id') id: string,
    @Body() data: CreateLimitedUserTicketDto,
  ) {
    return this.limitedTicketService.createNewTicket(id, data);
  }
}
