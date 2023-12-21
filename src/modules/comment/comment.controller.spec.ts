import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('commentController', () => {
  let commentController: CommentController;
  let moduleRef: TestingModule;
  let appRef: INestApplication;

  const mockCommentService = {};

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getOrThrow('AUTH_SECRET'),
            signOptions: {
              expiresIn: '7 days',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    commentController = moduleRef.get<CommentController>(CommentController);
    appRef = moduleRef.createNestApplication();
    await appRef.init();
  });

  afterAll(async () => {
    await appRef.close();
  });

  it('It should be defined.', () => {
    expect(commentController).toBeDefined();
  });

  describe('rateComment', () => {
    it('It should be defined.', () => {
      expect(commentController.rateComment).toBeDefined();
    });

    it('It should be callable.', () => {
      request(appRef.getHttpServer()).post('test/rate').expect(200);
    });
  });

  describe('softDeleteComment', () => {
    it('It should be defined.', () => {
      expect(commentController.softDeleteComment).toBeDefined();
    });

    it('It should be callable.', () => {
      request(appRef.getHttpServer()).delete('test').expect(200);
    });
  });
});
