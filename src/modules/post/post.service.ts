import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entitiy';
import { BaseService } from 'src/interfaces/base.service';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post_create.dto';
import { AuthUser } from '../auth/auth.guard';
import slugify from 'slugify';

@Injectable()
export class PostService extends BaseService<Post, Repository<Post>> {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {
    super(postRepo);
  }

  async findMany(): Promise<number> {
    return this.postRepo.count();
  }

  async createPost(user: AuthUser, data: PostCreateDto): Promise<Post> {
    const postStatus = data.status || 'DRAFT';
    const slug =
      slugify(data.title, {
        replacement: '_',
        trim: true,
      }) + `_${new Date().getTime()}`;

    return await this.repository.save({
      authorId: user.id,
      title: data.title,
      content: data.content,
      slug,
      status: postStatus,
    });
  }
}
