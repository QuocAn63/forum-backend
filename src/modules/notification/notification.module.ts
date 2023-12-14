import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EventsModule } from '../events/events.module';
import {
  NotificatioSubject,
  Notification,
} from './entities/notification.entity';

@Global()
@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forFeature([Notification, NotificatioSubject]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationModule, NotificationService, TypeOrmModule],
})
export class NotificationModule {}
