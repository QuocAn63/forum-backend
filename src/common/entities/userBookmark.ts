import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entitiy';

@Entity()
export class UserBookmark {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  postId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  createdAt: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
