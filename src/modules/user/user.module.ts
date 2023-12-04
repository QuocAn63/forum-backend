import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [PostService, UserService],
  controllers: [UserController],
  exports: [UserModule, TypeOrmModule],
})
export class UserModule {}
