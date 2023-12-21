import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { NotificationService } from '../notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserRatePost } from './entities/userRatePost.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { CommentRating } from './entities/userRateComment.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/auth.guard';
import { PostCreateDto } from './dto/post_create.dto';

describe('postService', () => {
  let postService: PostService;
  let moduleRef: TestingModule;
  let existedPostSlug = 'Post_title_F3vpLryAw7t';
  const userToken: any = {
    id: 'c2103294-3a9d-4b69-967f-d59192d03f21',
  };
  const mockPost: PostCreateDto = {
    title: 'test post title',
    content: 'test post content',
    status: 'DRAFT',
  };
  let insertedPostId: string;
  let mockNotificationService = {
    storeNotification: jest.fn(),
    pushNotificationToUser: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule.forRootAsync('TEST'),
        TypeOrmModule.forFeature([
          Post,
          UserRatePost,
          User,
          Role,
          Permission,
          Comment,
          CommentRating,
        ]),
      ],
      providers: [
        PostService,
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    postService = moduleRef.get<PostService>(PostService);
  });

  afterAll(async () => {
    await postService.delete(insertedPostId);
    await moduleRef.close();
  });

  it('It should be defined.', () => {
    expect(postService).toBeDefined();
  });

  describe('findBySlug', () => {
    it('It should be defined.', () => {
      expect(postService.findBySlug).toBeDefined();
    });

    it("It should return error 'Not Found'.", async () => {
      await expect(postService.findBySlug('test')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('It should return a post.', async () => {
      await expect(
        postService.findBySlug(existedPostSlug),
      ).resolves.toBeInstanceOf(Object);
    });
  });

  describe('findMany', () => {
    it('Should return array of posts.', async () => {
      await expect(postService.findMany()).resolves.toBeInstanceOf(Array);
    });
  });

  describe('findManyDeleted', () => {
    it('Should return array of deleted posts.', async () => {
      await expect(
        postService.findManyDeleted(userToken),
      ).resolves.toBeInstanceOf(Array);
    });
  });

  describe('createPost', () => {
    it('It should create a post and return the data.', async () => {
      const newPost = await postService.createPost(userToken, mockPost);

      expect(newPost).toBeInstanceOf(Object);
      insertedPostId = newPost.id;
    });
  });
});
