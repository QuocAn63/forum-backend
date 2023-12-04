import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { BaseService } from 'src/interfaces/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService extends BaseService<Comment, Repository<Comment>> {
  constructor(@InjectRepository(Comment) commentRepo: Repository<Comment>) {
    super(commentRepo);
  }
}
