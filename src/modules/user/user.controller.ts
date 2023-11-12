import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/userCreate.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
