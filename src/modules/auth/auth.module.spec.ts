import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const oneUser = {
  username: 'caoan632002',
  password: '123123456',
};

describe('AuthModule', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: 'test',
            signOptions: {
              expiresIn: '60s',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('AuthController should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });
});
