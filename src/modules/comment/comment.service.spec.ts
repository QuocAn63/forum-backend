import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRating } from '../post/entities/userRateComment.entity';

describe('commentService', () => {
  let commentService: CommentService;
  let moduleRef: TestingModule;

  const mockRepository = {};

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CommentRating),
          useValue: mockRepository,
        },
      ],
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
  });

  it('It should be defined.', () => {
    expect(commentService).toBeDefined();
  });

  describe('storeComment', () => {
    it('It should be defined.', () => {
      expect(commentService.storeComment).toBeDefined();
    });
  });

  describe('findPostComments', () => {
    it('It should be defined.', () => {
      expect(commentService.findPostComments).toBeDefined();
    });
  });

  describe('rateComment', () => {
    it('It should be defined.', () => {
      expect(commentService.rateComment).toBeDefined();
    });
  });

  describe('deleteComment', () => {
    it('It should be defined.', () => {
      expect(commentService.deleteComment).toBeDefined();
    });
  });
});
