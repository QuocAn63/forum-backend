import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../post/entities/post.entity';
import {
  CanActivate,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import * as request from 'supertest';
import { join } from 'path';
import { cwd } from 'process';
import { readFileSync } from 'fs';

describe('userController', () => {
  let userController: UserController;
  let moduleRef: TestingModule;
  let appRef: INestApplication;
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpZCI6IjA1ZjljOTRkLWE4ZDUtNDk2My1hZTI3LWRkYjkxNGFhZjBhZSIsInJvbGUiOnsiaWQiOiJVU0VSIiwicGVybWlzc2lvbnMiOiJQT1NUX1VQTE9BRCxQT1NUX1JBVEUsUE9TVF9CT09LTUFSSyxDT01NRU5UX0NSRUFURSxDT01NRU5UX1JBVEUifSwiZW1haWwiOiJjYW9hbjYzMjAwMkBnbWFpbC5jb20iLCJsaW1pdGVkUGVybWlzc2lvbnMiOiIiLCJpYXQiOjE3MDI2NDkyOTAsImV4cCI6MTcwMzI1NDA5MH0.ZkPojSrpRfEnz4em2bvMUFcnKfr25XVUdfJLlrWQnRM';
  const mockUser: Partial<User> = {
    id: 'testid',
    username: 'user',
    avatar: 'avatar.png',
    email: 'user@gmail.com',
    displayName: 'User',
    dob: '01/01/2003',
    gender: 'MALE',
  };

  const mockUserService = {
    findUserPublicProfile: jest.fn().mockImplementation((username: string) => {
      if (username !== 'user') {
        throw new NotFoundException();
      }
      return mockUser;
    }),
    index: jest.fn().mockImplementation(() => [mockUser]),
    updateDisplayName: jest.fn().mockReturnValue(true),
    updateAvatar: jest.fn().mockReturnValue(true),
  };

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    appRef = moduleRef.createNestApplication();
    await appRef.init();
  });

  afterAll(async () => {
    await appRef.close();
  });

  it('It should be defined.', () => {
    expect(userController).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('It should be defined.', () => {
      expect(userController.getUserProfile).toBeDefined();
    });

    it("should return 'Not found error'.", () => {
      expect(() => userController.getUserProfile('test')).toThrow(
        NotFoundException,
      );
    });

    it('should return user profile.', () => {
      expect(userController.getUserProfile('user')).toEqual({
        id: expect.any(String),
        username: expect.any(String),
        avatar: expect.any(String),
        email: expect.any(String),
        displayName: expect.any(String),
        dob: expect.any(String),
        gender: expect.any(String),
      });
    });
  });

  describe('updateDisplayName', () => {
    it('It should be defined.', () => {
      expect(userController.updateDisplayName).toBeDefined();
    });

    it('It should ensure that the AuthGuard applied on.', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        userController.updateDisplayName,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(AuthGuard);
    });
  });
});
