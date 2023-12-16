import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRatePost } from './userRatePost.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn({ length: 11 })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column('enum', { enum: ['DRAFT', 'PUBLIC', 'PRIVATE'] })
  status: string;

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

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: string;

  @OneToMany(() => UserRatePost, (userReact) => userReact.post)
  userReacts: UserRatePost[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
