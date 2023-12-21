import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionCreateDto } from './dto/permission_create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { CreateLimitedUserTicketDto } from '../limitedUserTicket/dto/limitedUserTicket_create.dto';
import { LimitedUserTicketService } from '../limitedUserTicket/limitedUserTicket.service';
import { RolesEnum } from '../role/role.constant';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate } from 'src/common/decorators/paginate.decorator';

@ApiTags('Permissions')
@UseGuards(AuthGuard, RoleGuard)
@Roles(RolesEnum.ADMIN)
@Controller('permissions')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private limitedTicketService: LimitedUserTicketService,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return list of permissions.' })
  @ApiUnauthorizedResponse({ description: 'User are not allowed to access.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Get()
  async getListOfPermission(@Paginate() paginate: any) {
    console.log(paginate);
    return await this.permissionService.index();
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Permission created.' })
  @ApiBadRequestResponse({ description: 'Permission already exist.' })
  @ApiUnauthorizedResponse({ description: 'User are not allowed to access.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post()
  async createPermission(@Body() createPermissionDto: PermissionCreateDto) {
    return await this.permissionService.store(createPermissionDto);
  }
}
