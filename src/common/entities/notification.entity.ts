import { User } from './user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sendTo: User;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  objectType: string;

  @Column({ type: 'varchar', nullable: true })
  objectId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  createdAt: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  readAt: boolean;

  @Column({
    type: 'text',
  })
  url: string;

  @OneToMany(() => NotificatioSubject, (subject) => subject.notification)
  subjects: NotificatioSubject[];
}

@Entity()
export class NotificatioSubject extends BaseEntity {
  @PrimaryColumn()
  notificationId: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Notification)
  notification: Notification;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  createdAt: string;
}
