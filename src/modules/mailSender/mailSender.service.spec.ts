import { Test, TestingModule } from '@nestjs/testing';
import { MailSenderService } from './mailSender.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailVerificationToken } from './entities/emailVerificationToken.entity';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../user/user.service';

describe('mailSenderService', () => {
  let service: MailSenderService;
  let moduleRef: TestingModule;

  const mockRepository = {};
  const mockUserService = {};

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MailSenderService,
        {
          provide: getRepositoryToken(EmailVerificationToken),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = moduleRef.get<MailSenderService>(MailSenderService);
  });

  it('It should be defined.', () => {
    expect(service).toBeDefined();
  });
});
