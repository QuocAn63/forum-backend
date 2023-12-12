import { InjectRepository } from '@nestjs/typeorm';
import {
  NotificatioSubject,
  Notification,
} from 'src/common/entities/notification.entity';
import { BaseService } from 'src/interfaces/base.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/notification_create.dto';
import { AuthUser } from '../auth/auth.guard';
import {
  NotificationContent,
  NotificationType,
  NotificationURL,
} from './notification.enum';

export class NotificationService extends BaseService<
  Notification,
  Repository<Notification>
> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(NotificatioSubject)
    private notificationSubjectRepo: Repository<NotificatioSubject>,
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

  async pushNotification(notification: Notification) {
    const subjects = await this.notificationSubjectRepo
      .createQueryBuilder('subjects')
      .where({ notificationId: notification.id })
      .leftJoinAndSelect('subjects.user', 'user')
      .select(['subjects', 'user.id', 'user.username', 'user.displayName'])
      .orderBy('subjects.createdAt', 'DESC')
      .getMany();

    console.log(subjects);

    if (!subjects.length) {
      return 'Empty subjects';
    }
    const subjectLength = subjects.length;
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

    return notification.content;
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
    let result;

    result = notifications.map(async (notification) => {
      // notification.content.replaceAll(/\[:Subject\]/, )
    });

    return result;
  }

  private async getDetailNotification(notification: Notification) {
    const type = notification.type;
    const subjects = await this.notificationSubjectRepo
      .createQueryBuilder('subjects')
      .where({ notificationId: notification.id })
      .leftJoinAndSelect('subjects.user', 'user')
      .select(['subjects', 'user.id', 'user.username', 'user.displayName'])
      .orderBy('subjects.createdAt', 'DESC')
      .getMany();

    const subjectLength = subjects.length;
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
  }
}
