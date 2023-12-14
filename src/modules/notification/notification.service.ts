import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/notification_create.dto';
import { AuthUser } from '../auth/auth.guard';
import {
  NotificationContent,
  NotificationType,
  NotificationURL,
} from './notification.enum';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from '../events/events.gateway';
import {
  NotificatioSubject,
  Notification,
} from './entities/notification.entity';

export class NotificationService extends BaseService<
  Notification,
  Repository<Notification>
> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(NotificatioSubject)
    private notificationSubjectRepo: Repository<NotificatioSubject>,
    private configService: ConfigService,
    private eventsGatway: EventsGateway,
  ) {
    super(notificationRepo);
  }

  async storeNotification(user: AuthUser, data: CreateNotificationDto) {
    const type = NotificationType[data.type];
    let content: string = NotificationContent[type] || 'Unkown type';
    let url = NotificationURL[type] || 'notfound';

    const notification = await this.createNotification(
      data.sendTo,
      type,
      content,
      data.objectType,
      data.objectId,
      url,
    );

    await this.createNotificationSubject(user, notification.id);

    return notification;
  }

  async pushNotificationToUser(notification: Notification, appURL: string) {
    const finalNotification = await this.getDetailNotification(
      notification,
      appURL,
    );

    await this.eventsGatway.pushNotification(
      notification.sendTo.id,
      finalNotification,
    );
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    content: string,
    objectType: string,
    objectId: string,
    url: string,
  ) {
    return this.repository.save({
      sendTo: { id: userId },
      type,
      content,
      objectType,
      objectId,
      url,
    });
  }

  async createNotificationSubject(user: AuthUser, id: string) {
    return this.notificationSubjectRepo.save({
      user: { id: user.id },
      notification: { id },
    });
  }

  async findUserNotifications(user: AuthUser) {
    let notifications = await this.repository.find({
      where: { sendTo: { id: user.id } },
      order: { createdAt: 'desc' },
    });
    const appURL = this.configService.get<string>('APP_URL');
    if (!notifications.length) {
      return [];
    }

    return await Promise.all(
      notifications.map(async (notification) => {
        return await this.getDetailNotification(notification, appURL);
      }),
    );
  }

  private async getDetailNotification(
    notification: Notification,
    appURL: string,
  ) {
    const type = notification.type;
    const subjects = await this.notificationSubjectRepo
      .createQueryBuilder('subjects')
      .where({ notificationId: notification.id })
      .leftJoinAndSelect('subjects.user', 'user')
      .select(['subjects', 'user.id', 'user.username', 'user.displayName'])
      .orderBy('subjects.createdAt', 'DESC')
      .getMany();

    notification.url = (NotificationURL[type] as string)
      .replaceAll(/\[:URL\]/g, appURL)
      .replaceAll(/\[:PostId\]/g, notification.objectId);

    const subjectLength = subjects.length;

    if (!subjectLength) {
      return notification;
    }

    let subjectDisplayText;

    switch (subjectLength) {
      case 1:
        subjectDisplayText = subjects[0].user.displayName;
        break;
      case 2:
        subjectDisplayText = `${subjects[0].user.displayName}, ${subjects[1].user.displayName}`;
      default:
        subjectDisplayText = `${subjects[0].user.displayName}, ${subjects[1].user.displayName} and others`;
        break;
    }

    notification.content = notification.content.replaceAll(
      /(\[:Subject\])/g,
      subjectDisplayText,
    );

    return notification;
  }
}
