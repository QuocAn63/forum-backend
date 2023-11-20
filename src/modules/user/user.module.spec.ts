import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';

describe('UserModule', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('UserController should be defined.', () => {
    expect(userController).toBeDefined();
  });

  it('UserService should be defined.', () => {
    expect(userService).toBeDefined();
  });
});
