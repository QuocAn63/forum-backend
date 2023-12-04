import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserBookmark } from 'src/common/entities/userBookmark';
import { UserLikesOrDislikesPost } from 'src/common/entities/userLikesOrDislikesPost.entity';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { CommentService } from '../comment/comment.sevice';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([Post, UserBookmark, UserLikesOrDislikesPost]),
  ],
  controllers: [PostController],
  providers: [CommentService, PostService],
  exports: [PostModule, TypeOrmModule, PostService],
})
export class PostModule {}
