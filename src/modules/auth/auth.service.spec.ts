import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PostService } from '../post/post.service';
import { MailSenderService } from '../mailSender/mailSender.service';
import { LimitedUserTicketService } from '../limitedUserTicket/limitedUserTicket.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DataSourceProvider } from '../../../test/helpers/testDataSource.provider';
import { LimitedUserTicket } from '../limitedUserTicket/entities/limitedUserTicket.entity';
import { PermissionService } from '../permission/permission.service';

class MockingService {}

describe('AuthService', () => {
  let authService: AuthService;
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          global: true,
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getOrThrow('AUTH_SECRET'),
            signOptions: {
              expiresIn: '7 days',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        DataSourceProvider,
        UserService,
        { provide: MailSenderService, useClass: MockingService },
        { provide: PostService, useClass: MockingService },
        { provide: PermissionService, useClass: MockingService },
        LimitedUserTicketService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(User);
          },
          inject: [DataSource],
        },
        {
          provide: getRepositoryToken(LimitedUserTicket),
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(LimitedUserTicket);
          },
          inject: [DataSource],
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    moduleRef.close();
  });

  it('Should be defined.', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('It should be defined.', () => {
      expect(authService.validateUser).toBeDefined();
    });

    it("It should return error: 'User not found.'", async () => {
      try {
        await authService.validateUser({ username: 'test', password: '123' });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it("It should return error: 'Invalid password.'", async () => {
      try {
        await authService.validateUser({
          username: 'user',
          password: '123123',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('If login success, it will return token', async () => {
      const result = await authService.validateUser({
        username: 'user',
        password: '123123',
      });

      expect(result).toBeInstanceOf(Object);
      expect(typeof result.message).toBe('string');
      expect(typeof result.token).toBe('string');
    });
  });

  describe('createUser', () => {
    it('It should be defined.', () => {
      expect(authService.createUser).toBeDefined();
    });

    it("It will return error: 'Password confirm does not match.'", async () => {
      try {
        await authService.createUser({
          username: 'user1',
          password: '123123',
          retypedPassword: '1231234',
          email: 'caoan632002@gmail.com',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Password confirm does not match.');
      }
    });

    it("It will return error: 'User already exist.'", async () => {
      try {
        await authService.createUser({
          username: 'user',
          password: '123123',
          retypedPassword: '123123',
          email: 'caoan632002123@gmail.com',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('User already exist.');
      }
    });

    it("It will return error: 'Email already exist.'", async () => {
      try {
        await authService.createUser({
          username: 'user12',
          password: '123123',
          retypedPassword: '123123',
          email: 'caoan632002@gmail.com',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Email already exist.');
      }
    });
  });
});
