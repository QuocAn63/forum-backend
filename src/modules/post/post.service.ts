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
import { PostUpdateDto } from './dto/post_update.dto';
import { SlugifyUtil } from 'src/utils/slugify.util';
import { UserLikesOrDislikesPost } from 'src/common/entities/userLikesOrDislikesPost.entity';
import { nanoid } from 'nanoid';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class PostService extends BaseService<Post, Repository<Post>> {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(UserLikesOrDislikesPost)
    private rateRepo: Repository<UserLikesOrDislikesPost>,
    private commentService: CommentService,
  ) {
    super(postRepo);
  }

  async findBySlug(slug: string): Promise<any> {
    const post = await this.detailTypePost()
      .where({ slug, status: 'PUBLIC' })
      .select([
        'post',
        'author.username',
        'author.id',
        'author.displayName',
        'comments',
      ])
      .getOne();

    if (!post) throw new NotFoundException('Post not found.');

    return post;
  }

  async findMany(): Promise<any> {
    return this.listTypePost()
      .where({ status: 'PUBLIC' })
      .select(['posts', 'author.username', 'author.displayName', 'author.id'])
      .getMany();
  }

  async findManyDeleted(user: AuthUser): Promise<any> {
    return this.listTypePost()
      .where({
        deletedAt: Not(IsNull()),
        author: { id: user.id },
      })
      .withDeleted()
      .select(['posts', 'author.username', 'author.displayName', 'author.id'])
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
      where: { id, author: { id: user.id } },
    });

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
    const result = await this.repository.restore({
      author: { id: user.id },
      id,
    });

    if (!result.affected)
      throw new BadRequestException(
        'Can not find post or you are not the onwer.',
      );

    return result.affected;
  }

  async findPostsOfUser(username: string): Promise<any> {
    console.log(username);
    const posts = await this.listTypePost()
      .where({ author: { username }, status: 'PUBLIC' })
      .select(['posts', 'author.username', 'author.displayName', 'author.id'])
      .getMany();

    return posts;
  }

  async softDeletePost(user: AuthUser, id: string): Promise<any> {
    const result = await this.repository.softDelete({
      author: { id: user.id },
      id,
    });

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

  private detailTypePost(alias = 'post') {
    return this.repository
      .createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.author`, 'author')
      .loadRelationCountAndMap(
        `${alias}.likesCount`,
        `${alias}.userReacts`,
        'ur',
        (qb) => qb.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        `${alias}.dislikesCount`,
        `${alias}.userReacts`,
        'ur',
        (qb) => qb.andWhere({ action: 'DISLIKE' }),
      )
      .loadRelationCountAndMap(
        `${alias}.bookmarksCount`,
        `${alias}.userBookmarks`,
      )
      .leftJoinAndSelect(`${alias}.comments`, 'comments');
  }

  private listTypePost(alias = 'posts') {
    return this.repository
      .createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.author`, 'author')
      .loadRelationCountAndMap(
        `${alias}.likesCount`,
        `${alias}.userReacts`,
        'ur',
        (qb) => qb.andWhere({ action: 'LIKE' }),
      )
      .loadRelationCountAndMap(
        `${alias}.dislikesCount`,
        `${alias}.userReacts`,
        'ur',
        (qb) => qb.andWhere({ action: 'DISLIKE' }),
      )
      .loadRelationCountAndMap(
        `${alias}.bookmarksCount`,
        `${alias}.userBookmarks`,
      )
      .loadRelationCountAndMap(`${alias}.commentsCount`, `${alias}.comments`);
  }
}
