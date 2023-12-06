import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { User } from 'src/common/entities/user.entity';
import { UserLikesOrDislikesComment } from 'src/common/entities/userLikesOrDislikesComment.entity';
import { PostModule } from '../post/post.module';
import { CommentService } from './comment.service';

@Module({
  imports: [
    forwardRef(() => PostModule),
    forwardRef(() => User),
    TypeOrmModule.forFeature([Comment, UserLikesOrDislikesComment]),
  ],
  providers: [CommentService],
  exports: [CommentModule, TypeOrmModule, CommentService],
})
export class CommentModule {}
