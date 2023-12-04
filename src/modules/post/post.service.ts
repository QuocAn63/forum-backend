import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { BaseService } from 'src/interfaces/base.service';
import { IsNull, Not, Repository } from 'typeorm';
import { PostCreateDto } from './dto/post_create.dto';
import { AuthUser } from '../auth/auth.guard';
import { Comment } from 'src/common/entities/comment.entity';
import { PostUpdateDto } from './dto/post_update.dto';
import { SlugifyUtil } from 'src/utils/slugify.util';
import { UserLikesOrDislikesPost } from 'src/common/entities/userLikesOrDislikesPost.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class PostService extends BaseService<Post, Repository<Post>> {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(UserLikesOrDislikesPost)
    private rateRepo: Repository<UserLikesOrDislikesPost>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {
    super(postRepo);
  }

  async findBySlug(slug: string): Promise<any> {
    const post = await this.repository
      .createQueryBuilder('post')
      .where({ slug, status: 'PUBLIC' })
      .leftJoinAndSelect('post.author', 'author')
      .select(['post', 'author.username', 'author.displayName'])
      .loadRelationCountAndMap(
        'post.usersLike',
        'post.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        'post.usersDislike',
        'post.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'DISLIKE' }),
      )
      .loadRelationCountAndMap('post.userBookmarks', 'post.userBookmarks')
      .getOne();

    if (!post) throw new NotFoundException('Post not found.');

    const comments =
      (await this.commentRepo.findBy({ post: { id: post.id } })) || [];

    return { post, comments };
  }

  async findMany(): Promise<any> {
    return this.repository
      .createQueryBuilder('posts')
      .where({ status: 'PUBLIC' })
      .leftJoinAndSelect('posts.author', 'author')
      .select(['posts', 'author.username', 'author.displayName'])
      .loadRelationCountAndMap(
        'posts.usersLike',
        'posts.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        'posts.usersDislike',
        'posts.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'DISLIKE' }),
      )
      .loadRelationCountAndMap('posts.userBookmarks', 'posts.userBookmarks')
      .getMany();
  }

  async findManyDeleted(user: AuthUser): Promise<any> {
    return this.repository
      .createQueryBuilder('posts')
      .where({
        deletedAt: Not(IsNull()),
        authorId: user.id,
      })
      .getMany();
  }

  async createPost(user: AuthUser, data: PostCreateDto): Promise<Post> {
    const id = nanoid(11);
    const postStatus = data.status || 'DRAFT';
    const slug = SlugifyUtil.generatePostSlug(id, data.title);

    return await this.repository.save({
      id,
      authorId: user.id,
      title: data.title,
      content: data.content,
      slug,
      status: postStatus,
    });
  }

  async updatePost(
    user: AuthUser,
    id: string,
    data: PostUpdateDto,
  ): Promise<any> {
    const post = await this.repository.findOne({
      where: { id, authorId: user.id },
    });

    console.log(`${id} ${user.id}`);

    if (!post)
      throw new BadRequestException(
        'Can not find post or you are not the owner.',
      );

    let newSlug = post.slug;

    if (data.title && data.title !== post.title) {
      newSlug = SlugifyUtil.generatePostSlug(post.id, data.title);
    }

    const result = await this.repository.update(
      {
        id: post.id,
      },
      {
        ...data,
        slug: newSlug,
      },
    );

    return result.affected;
  }

  async restorePost(user: AuthUser, id: string): Promise<any> {
    const result = await this.repository.restore({ authorId: user.id, id });

    if (!result.affected)
      throw new BadRequestException(
        'Can not find post or you are not the onwer.',
      );

    return result.affected;
  }

  async findPostsOfUser(userId: string): Promise<any> {
    const posts = await this.repository
      .createQueryBuilder('posts')
      .where({ authorId: userId, status: 'PUBLIC' })
      .leftJoinAndSelect('posts.author', 'author')
      .select(['posts', 'author.username', 'author.displayName'])
      .loadRelationCountAndMap(
        'posts.usersLike',
        'posts.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        'posts.usersDislike',
        'posts.userReacts',
        'ur',
        (qb) => qb.andWhere({ action: 'DISLIKE' }),
      )
      .loadRelationCountAndMap('posts.userBookmarks', 'posts.userBookmarks')
      .getMany();

    return posts;
  }

  async softDeletePost(user: AuthUser, id: string): Promise<any> {
    const result = await this.repository.softDelete({ authorId: user.id, id });

    if (!result.affected)
      throw new BadRequestException(
        'Can not find post or you are not the onwer.',
      );

    return result.affected;
  }

  async ratePost(user: AuthUser, id: string, action: string): Promise<any> {
    const rate = await this.rateRepo.save({
      postId: id,
      userId: user.id,
      action,
    });

    return { post: rate.postId, action: rate.action };
  }
}
