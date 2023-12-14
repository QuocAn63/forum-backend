import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentCreateDto } from './dto/comment_create.dto';
import { AuthUser } from '../auth/auth.guard';
import { Comment } from './entities/comment.entity';
import { CommentRating } from '../post/entities/userRateComment.entity';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService extends BaseService<Comment, Repository<Comment>> {
  constructor(
    @InjectRepository(Comment) commentRepo: Repository<Comment>,
    @InjectRepository(CommentRating)
    private commentRatingRepo: Repository<CommentRating>,
  ) {
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

    if (commentCreateDto.parentId) {
      const parentCommentObj = new Comment();
      parentCommentObj.id = commentCreateDto.parentId;
      commentObj.parent = parentCommentObj;
    }

    const comment = await commentObj.save();

    return comment;
  }

  async findPostComments(slug: string) {
    return this.listTypeComment()
      .where({ post: { slug } })
      .select([
        'comments',
        'replies',
        'author.id',
        'author.username',
        'author.displayName',
      ])
      .getMany();
  }

  async rateComment(user: AuthUser, id: string, action: string) {
    return this.commentRatingRepo.save({
      user: { id: user.id },
      comment: { id },
      action,
    });
  }

  async deleteComment(user: AuthUser, id: string) {
    return this.repository.softDelete({ id, author: { id: user.id } });
  }

  private listTypeComment() {
    return this.repository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.post', 'post')
      .leftJoinAndSelect('comments.author', 'author')
      .leftJoinAndSelect('comments.children', 'replies')
      .loadRelationCountAndMap(
        'comments.likesCount',
        'comments.commentRatings',
        'cr',
        (cr) => cr.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        'comments.dislikesCount',
        'comments.commentRatings',
        'cr',
        (cr) => cr.andWhere({ action: 'DISLIKE' }),
      );
  }
}
