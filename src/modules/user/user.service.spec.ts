import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from '../post/post.service';

describe('userService', () => {
  let userService: UserService;
  let moduleRef: TestingModule;

  const mockUser = {
    id: 'c2103294-3a9d-4b69-967f-d59192d03f21',
    username: 'admin',
    email: 'caoan632002dev@gmail.com',
    password: '$2b$10$AjwIBSUvy/x/c5ZJ6ui2PeNcBReHT92N7YG6EgxUXO6SOvCzoNiG.',
    displayName: 'Quoc An - Admin1',
    avatar: null,
    dob: null,
    gender: null,
    lastLoginAt: '2023-12-15T14:08:02.834Z',
    isEmailVerified: false,
    createdAt: '2023-12-07T15:22:51.711Z',
    updatedAt: '2023-12-15T14:20:52.289Z',
    roleId: 'ADMIN',
  };

  const mockUserRepository = {
    findOne: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockReturnValue(mockUser),
    update: jest.fn().mockReturnValue(true),
  };

  const mockPostService = {
    findPostsOfUser: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: PostService, useValue: mockPostService },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it('It should be defined.', () => {
    expect(userService).toBeDefined();
  });

  describe('findUserPublicProfile', () => {
    it('It should be defined.', () => {
      expect(userService.findUserPublicProfile).toBeDefined();
    });

    it('It should return a user object.', async () => {
      expect(await userService.findUserPublicProfile('test')).toBeInstanceOf(
        Object,
      );
    });
  });
});
