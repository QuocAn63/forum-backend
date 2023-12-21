import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { IsNull, Not, Repository } from 'typeorm';
import { PostCreateDto } from './dto/post_create.dto';
import { AuthUser } from '../auth/auth.guard';
import { PostUpdateDto } from './dto/post_update.dto';
import { SlugifyUtil } from '../../utils/slugify.util';
import { nanoid } from 'nanoid';
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { Post } from './entities/post.entity';
import { UserRatePost } from './entities/userRatePost.entity';
import { PaginateMetadata } from 'src/interfaces/response.interface';

@Injectable()
export class PostService extends BaseService<Post, Repository<Post>> {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(UserRatePost) private rateRepo: Repository<UserRatePost>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {
    super(postRepo);
  }

  async findBySlug(slug: string): Promise<any> {
    const post = await this.detailTypePost()
      .where({ slug, status: 'PUBLIC' })
      .select(['post', 'author.username', 'author.id', 'author.displayName'])
      .getOne();

    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

  async findMany(paginate: PaginateMetadata): Promise<any> {
    return this.listTypePost(paginate)
      .where({ status: 'PUBLIC' })
      .select(['posts', 'author.username', 'author.displayName', 'author.id'])
      .getMany();
  }

  async findManyDeleted(
    user: AuthUser,
    paginate: PaginateMetadata,
  ): Promise<any> {
    return this.listTypePost(paginate)
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

  async findPostsOfUser(
    username: string,
    paginate: PaginateMetadata,
  ): Promise<any> {
    const posts = await this.listTypePost(paginate)
      .where({ author: { username }, status: 'PUBLIC' })
      .select(['posts', 'author.username', 'author.displayName', 'author.id'])
      .offset((paginate.page - 1) * paginate.pageSize)
      .limit(paginate.pageSize)
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

    const postAuthor = (
      await this.repository.findOne({ where: { id }, relations: ['author'] })
    ).author;

    const notification = await this.notificationService.storeNotification(
      user,
      {
        objectId: id,
        objectType: 'POST',
        sendTo: postAuthor.id,
        type: 'PostLike',
      },
    );

    await this.notificationService.pushNotificationToUser(
      notification,
      this.configService.get<string>('APP_URL'),
    );

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
      .loadRelationCountAndMap(`${alias}.commentsCount`, `${alias}.comments`);
  }

  private listTypePost(paginate: PaginateMetadata, alias = 'posts') {
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
      .loadRelationCountAndMap(`${alias}.commentsCount`, `${alias}.comments`)
      .offset((paginate.page - 1) * paginate.pageSize)
      .limit(paginate.pageSize);
  }
}
