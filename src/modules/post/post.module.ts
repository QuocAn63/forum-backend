import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { User } from 'src/common/entities/user.entity';
import { UserBookmark } from 'src/common/entities/userBookmark';
import { UserLikesOrDislikesPost } from 'src/common/entities/userLikesOrDislikesPost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      UserBookmark,
      UserLikesOrDislikesPost,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
