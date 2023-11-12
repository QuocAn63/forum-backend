import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { User } from 'src/common/entities/user.entity';
import { UserBookmark } from 'src/common/entities/userBookmark';
import { UserLikesOrDislikesPost } from 'src/common/entities/userLikesOrDislikesPost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      UserLikesOrDislikesPost,
      UserBookmark,
    ]),
  ],
})
export class PostModule {}
