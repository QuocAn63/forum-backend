import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostCreateDto } from './dto/post_create.dto';
import { AuthGuard, AuthUser, Public } from '../auth/auth.guard';
import { Permissions } from '../permission/permission.decorator';
import { User } from '../auth/user.decorator';
import { PostUpdateDto } from './dto/post_update.dto';
import { PostRateDto } from './dto/post_rate.dto';
import { CommentCreateDto } from '../comment/dto/comment_create.dto';
import { CommentService } from '../comment/comment.service';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Permission } from '../permission/permission.constant';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  @Get('deleted')
  async findDeletePosts(@User() user: AuthUser) {
    return await this.postService.findManyDeleted(user);
  }

  @Public()
  @Get(':slug')
  async findPostBySlug(@Param('slug') slug: any) {
    return await this.postService.findBySlug(slug);
  }

  @Public()
  @Get()
  async findMany() {
    return await this.postService.findMany();
  }

  @Public()
  @Get(':slug/comments')
  async findPostComments(@Param('slug') slug: string) {
    return await this.commentService.findPostComments(slug);
  }

  @Post()
  @Permissions(Permission.UploadPost)
  async createPost(
    @Body() postCreateDto: PostCreateDto,
    @User() user: AuthUser,
  ) {
    return await this.postService.createPost(user, postCreateDto);
  }

  @Post(':id/rate')
  @Permissions(Permission.RatePost)
  async ratePost(
    @User() user: AuthUser,
    @Param('id') id: string,
    @Body() data: PostRateDto,
  ) {
    return this.postService.ratePost(user, id, data.action);
  }

  @Post(':id/comment')
  @Permissions(Permission.CreateComment)
  async comment(
    @User() user: AuthUser,
    @Param('id') id: string,
    @Body() data: CommentCreateDto,
  ) {
    return await this.commentService.storeComment(user, id, data);
  }

  @Patch(':id/restore')
  async restorePost(@User() user: AuthUser, @Param('id') id: string) {
    return this.postService.restorePost(user, id);
  }

  @Patch(':id')
  async updatePost(
    @Body() postUpdateDto: PostUpdateDto,
    @Param('id') id: string,
    @User() user: AuthUser,
  ) {
    return await this.postService.updatePost(user, id, postUpdateDto);
  }

  @Delete(':id')
  async softDeletePost(@Param('id') id: string, @User() user: AuthUser) {
    return await this.postService.softDeletePost(user, id);
  }
}
