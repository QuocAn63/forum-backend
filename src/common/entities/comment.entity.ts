import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  author: User;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  parent: Comment;

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
    default: 'now()',
    nullable: true,
  })
  deletedAt: string;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @OneToMany(() => UserLikesOrDislikesComment, (userReact) => userReact.comment)
  userReacts: UserLikesOrDislikesComment[];
}
