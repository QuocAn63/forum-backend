import { Test, TestingModule } from '@nestjs/testing';
import { LimitedUserTicketService } from './limitedUserTicket.service';

describe('limitedUserTicketService', () => {
  let service: LimitedUserTicketService;
  let moduleRef: TestingModule;

  const mockLimitedTicketRepo = {};

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        LimitedUserTicketService,
        { provide: LimitedUserTicketService, useValue: mockLimitedTicketRepo },
      ],
    }).compile();

    service = moduleRef.get<LimitedUserTicketService>(LimitedUserTicketService);
  });

  it('It should be defined.', () => {
    expect(service).toBeDefined();
  });
});
