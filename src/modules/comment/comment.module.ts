import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { CommentRating } from 'src/common/entities/userRateComment.entity';
import { PostModule } from '../post/post.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

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
