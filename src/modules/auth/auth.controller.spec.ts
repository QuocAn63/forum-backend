import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailSenderService } from '../mailSender/mailSender.service';
import { AuthUser } from './auth.guard';

describe('authController', () => {
  let authController: AuthController;
  let moduleRef: TestingModule;
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpZCI6IjA1ZjljOTRkLWE4ZDUtNDk2My1hZTI3LWRkYjkxNGFhZjBhZSIsInJvbGUiOnsiaWQiOiJVU0VSIiwicGVybWlzc2lvbnMiOiJQT1NUX1VQTE9BRCxQT1NUX1JBVEUsUE9TVF9CT09LTUFSSyxDT01NRU5UX0NSRUFURSxDT01NRU5UX1JBVEUifSwiZW1haWwiOiJjYW9hbjYzMjAwMkBnbWFpbC5jb20iLCJsaW1pdGVkUGVybWlzc2lvbnMiOiIiLCJpYXQiOjE3MDIwMjYxOTEsImV4cCI6MTcwMjYzMDk5MX0.k3S5EMhvWiKlvnTlA05pZoP78jbcyKGZ-5QVNXK89Qg';
  const adminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiJjMjEwMzI5NC0zYTlkLTRiNjktOTY3Zi1kNTkxOTJkMDNmMjEiLCJyb2xlIjp7ImlkIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6IlBPU1RfVVBMT0FELFBPU1RfUkFURSxQT1NUX0JPT0tNQVJLLFBPU1RfREVMRVRFLENPTU1FTlRfQ1JFQVRFLENPTU1FTlRfUkFURSxDT01NRU5UX0RFTEVURSxVU0VSX0JBTiJ9LCJlbWFpbCI6ImNhb2FuNjMyMDAyZGV2QGdtYWlsLmNvbSIsImxpbWl0ZWRQZXJtaXNzaW9ucyI6IiIsImlhdCI6MTcwMjQ1MDk2MSwiZXhwIjoxNzAzMDU1NzYxfQ.gW4H2e9KvRmtrgKoJBVgPJKgD4fxjtk12kD81ZD5OgI';

  let mockAuthService = {
    validateUser: jest.fn().mockImplementation(async (data: any) => ({
      username: data.username,
    })),
    createUser: jest.fn().mockImplementation(() => true),
    verifyUser: jest
      .fn()
      .mockImplementation((token: string, user: AuthUser) => {
        return token === '123';
      }),
    changePassword: jest.fn(),
  };

  let mockMailSenderService = {
    resendVerificationMail: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        JwtService,
        ConfigService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: MailSenderService,
          useValue: mockMailSenderService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('It should be defined.', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('It should be defined.', () => {
      expect(authController.login).toBeDefined();
    });

    it('It should return user informations.', async () => {
      const result = await authController.login({
        username: 'caoan',
        password: '123123',
      });

      expect(result).toEqual({
        username: expect.any(String),
      });
    });
  });
});
