import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { CommentRating } from '../post/entities/userRateComment.entity';

@Module({
  imports: [
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([Comment, CommentRating]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentModule, TypeOrmModule, CommentService],
})
export class CommentModule {}
