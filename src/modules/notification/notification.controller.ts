import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/notification_create.dto';
import { NotificationService } from './notification.service';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { User } from '../auth/user.decorator';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate } from 'src/common/decorators/paginate.decorator';
import { PaginateMetadata } from 'src/interfaces/response.interface';

@ApiTags('Notifications')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: "Return user's notifications." })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Roles('USER', 'ADMIN')
  @Get()
  async testGetNotification(
    @User() user: AuthUser,
    @Paginate() paginate: PaginateMetadata,
  ) {
    return await this.notificationService.findUserNotifications(user, paginate);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update notification status.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Patch(':id/status')
  async updateNotificationStatus(
    @User() user: AuthUser,
    @Param('id') id: string,
  ) {
    return await this.updateNotificationStatus(user, id);
  }
}
