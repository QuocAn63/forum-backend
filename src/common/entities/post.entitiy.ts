import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserBookmark } from './userBookmark';
import { UserLikesOrDislikesPost } from './userLikesOrDislikesPost.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('text')
  slug: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column('enum', { enum: ['DRAFT', 'PUBLIC', 'PRIVATE'] })
  status: string;

  @Column('boolean', { default: false })
  isDeleted: boolean;

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
    default: 'now()',
    nullable: true,
  })
  deletedAt: string;

  @OneToMany(() => UserBookmark, (userBookmark) => userBookmark.post)
  userBookmarks: UserBookmark[];

  @OneToMany(() => UserLikesOrDislikesPost, (userReact) => userReact.post)
  userReacts: UserLikesOrDislikesPost[];
}
