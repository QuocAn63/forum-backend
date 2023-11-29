import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, Public } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':username')
  getUserProfile(@Param() params: any) {
    return this.userService.getUserProfile(params.username);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  getListOfUser() {
    return this.userService.index();
  }
}
