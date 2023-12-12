import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateNotificationDto } from './dto/notification_create.dto';
import { NotificationService } from './notification.service';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { User } from '../auth/user.decorator';
import { Domain } from 'src/common/decorators/domain';

@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Roles('ADMIN')
  @Post('testCreate')
  async testNotification(
    @User() user: AuthUser,
    @Body() data: CreateNotificationDto,
    @Domain() url: URL,
  ) {
    return await this.notificationService.storeNotification(user, data);
  }

  @Roles('USER', 'ADMIN')
  @Get()
  async testPushNotification(@User() user: AuthUser, @Domain() url: URL) {}
}
