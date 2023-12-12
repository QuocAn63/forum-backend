import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { UserRatePost } from '../../common/entities/UserRatePost.entity';

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
