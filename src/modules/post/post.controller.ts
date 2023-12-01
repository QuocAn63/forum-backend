import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostCreateDto } from './dto/post_create.dto';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import { Permissions } from '../permission/permission.decorator';
import { permissionConstants } from '../permission/permission.constant';
import { User } from '../auth/user.decorator';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get(':slug')
  async findPostBySlug(@Param() param: any) {
    const slug = param['slug'];
  }

  @Get()
  async findMany() {
    return await this.postService.index();
  }

  @Post()
  @UseGuards(AuthGuard)
  @Permissions('POST_UPLOAD')
  async createPost(
    @Body() postCreateDto: PostCreateDto,
    @User() user: AuthUser,
  ) {
    return await this.postService.createPost(user, postCreateDto);
  }
}
