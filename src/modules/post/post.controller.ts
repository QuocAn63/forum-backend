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
import { Permission } from '../permission/permission.constant';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate } from 'src/common/decorators/paginate.decorator';
import { PaginateMetadata } from 'src/interfaces/response.interface';

@ApiTags('Posts')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return deleted posts of a user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Get('deleted')
  async findDeletePosts(
    @User() user: AuthUser,
    @Paginate() paginate: PaginateMetadata,
  ) {
    return await this.postService.findManyDeleted(user, paginate);
  }

  @ApiOkResponse({ description: 'Find post by slug.' })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Public()
  @Get(':slug')
  async findPostBySlug(@Param('slug') slug: any) {
    return await this.postService.findBySlug(slug);
  }

  @ApiOkResponse({ description: 'Get list of posts.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Public()
  @Get()
  async findMany(@Paginate() paginate: PaginateMetadata) {
    return await this.postService.findMany(paginate);
  }

  @ApiOkResponse({ description: "Get list of post's comments." })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Public()
  @Get(':slug/comments')
  async findPostComments(@Param('slug') slug: string) {
    return await this.commentService.findPostComments(slug);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Upload post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post()
  @Permissions(Permission.UploadPost)
  async createPost(
    @Body() postCreateDto: PostCreateDto,
    @User() user: AuthUser,
  ) {
    return await this.postService.createPost(user, postCreateDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Rate a post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post(':id/rate')
  @Permissions(Permission.RatePost)
  async ratePost(
    @User() user: AuthUser,
    @Param('id') id: string,
    @Body() data: PostRateDto,
  ) {
    return this.postService.ratePost(user, id, data.action);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Comment on a post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post(':id/comment')
  @Permissions(Permission.CreateComment)
  async comment(
    @User() user: AuthUser,
    @Param('id') id: string,
    @Body() data: CommentCreateDto,
  ) {
    return await this.commentService.storeComment(user, id, data);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Restore a deleted post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Patch(':id/restore')
  async restorePost(@User() user: AuthUser, @Param('id') id: string) {
    return this.postService.restorePost(user, id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Patch(':id')
  async updatePost(
    @Body() postUpdateDto: PostUpdateDto,
    @Param('id') id: string,
    @User() user: AuthUser,
  ) {
    return await this.postService.updatePost(user, id, postUpdateDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete a post.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Delete(':id')
  async softDeletePost(@Param('id') id: string, @User() user: AuthUser) {
    return await this.postService.softDeletePost(user, id);
  }
}
