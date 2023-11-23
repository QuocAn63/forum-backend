import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LimitedUserTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  updatedAt: string;

  @Column({ type: 'timestamp' })
  endAt: string;

  @Column({ type: 'boolean', default: false })
  isExpired: boolean;

  @Column({ type: 'text' })
  limitedPermissions: string;
}
