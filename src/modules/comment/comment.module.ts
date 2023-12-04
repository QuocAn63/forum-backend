import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { User } from 'src/common/entities/user.entity';
import { UserLikesOrDislikesComment } from 'src/common/entities/userLikesOrDislikesComment.entity';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    forwardRef(() => PostModule),
    forwardRef(() => User),
    TypeOrmModule.forFeature([Comment, UserLikesOrDislikesComment]),
  ],
  exports: [CommentModule, TypeOrmModule],
})
export class CommentModule {}
