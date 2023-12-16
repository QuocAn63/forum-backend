import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { LimitedUserTicketModule } from '../limitedUserTicket/limitedUserTicket.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { AuthModule } from '../auth/auth.module';
import { MailSenderModule } from '../mailSender/mailSender.module';
import { NotificationModule } from '../notification/notification.module';
import { EventsModule } from '../events/events.module';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRootAsync('DEV'),
    UserModule,
    AuthModule,
    RoleModule,
    PostModule,
    CommentModule,
    PermissionModule,
    LimitedUserTicketModule,
    MailSenderModule,
    NotificationModule,
    EventsModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
