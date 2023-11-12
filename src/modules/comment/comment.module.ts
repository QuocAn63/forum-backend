import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { Post } from 'src/common/entities/post.entitiy';
import { User } from 'src/common/entities/user.entity';
import { UserLikesOrDislikesComment } from 'src/common/entities/userLikesOrDislikesComment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, UserLikesOrDislikesComment, Post]),
  ],
})
export class CommentModule {}
