import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entitiy';
import { UserLikesOrDislikesComment } from './userLikesOrDislikesComment.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @Column('text')
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: `now()`,
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: `now()`,
    nullable: true,
  })
  updatedAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: string;

  // @OneToMany(() => UserLikesOrDislikesComment, (userReact) => userReact.comment)
  // @JoinColumn()
  // userReacts: UserLikesOrDislikesComment[];
}
