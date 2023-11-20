import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  getUserProfile(@Param() params: any) {
    return this.userService.getUserProfile(params.username);
  }
}
