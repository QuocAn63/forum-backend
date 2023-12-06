import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { BaseService } from 'src/interfaces/base.service';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentCreateDto } from './dto/comment_create.dto';
import { AuthUser } from '../auth/auth.guard';
import { User } from 'src/common/entities/user.entity';
import { Post } from 'src/common/entities/post.entitiy';

@Injectable()
export class CommentService extends BaseService<Comment, Repository<Comment>> {
  constructor(@InjectRepository(Comment) commentRepo: Repository<Comment>) {
    super(commentRepo);
  }

  async storeComment(
    user: AuthUser,
    postId: string,
    commentCreateDto: CommentCreateDto,
  ) {
    const userObj = new User();
    userObj.id = user.id;
    const postObj = new Post();
    postObj.id = postId;

    const commentObj = this.repository.create({
      author: userObj,
      post: postObj,
      content: commentCreateDto.content,
    });

    // if (commentCreateDto.parentCommentId) {
    //   commentObj.parentId = commentCreateDto.parentCommentId;
    // }

    const comment = await commentObj.save();

    return comment;
  }

  async findPostComments(id: string) {
    return this.repository
      .createQueryBuilder('comments')
      .where({ post: { id } })
      .leftJoinAndSelect('comments.author', 'author')
      .select([
        'comments',
        'author.username',
        'author.id',
        'author.displayName',
      ])
      .orderBy('comments.createdAt', 'DESC')
      .getMany();
  }
}
