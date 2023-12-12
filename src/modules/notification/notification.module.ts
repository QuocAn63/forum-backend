import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NotificatioSubject,
  Notification,
} from 'src/common/entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificatioSubject])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [],
})
export class NotificationModule {}
