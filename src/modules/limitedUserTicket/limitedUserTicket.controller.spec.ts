import { Test, TestingModule } from '@nestjs/testing';
import { LimitedUserTicketController } from './limitedUserTicket.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LimitedUserTicketService } from './limitedUserTicket.service';

describe('limitedUserTicketController', () => {
  let controller: LimitedUserTicketController;
  let moduleRef: TestingModule;

  const mockService = {};

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
      controllers: [LimitedUserTicketController],
      providers: [
        {
          provide: LimitedUserTicketService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = moduleRef.get<LimitedUserTicketController>(
      LimitedUserTicketController,
    );
  });

  it('It should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
