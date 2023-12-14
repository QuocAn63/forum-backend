import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { Post } from './entities/post.entity';
import { UserRatePost } from './entities/UserRatePost.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([Post, UserRatePost]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostModule, TypeOrmModule, PostService],
})
export class PostModule {}
