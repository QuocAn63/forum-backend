import { Controller, Param, Get, UseGuards, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, AuthUser, Public } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { User } from '../auth/user.decorator';
import { ChangeDisplayNameDto } from './dto/user_changename.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.userService.getUserProfile(username);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  getUsers() {
    return this.userService.index();
  }

  @Get(':username/posts')
  getUserPosts(@Param('username') username: string) {
    return this.userService.getUserPosts(username);
  }

  @UseGuards(AuthGuard)
  @Post('changedisplayname')
  async updateUserDisplayName(
    @User() user: AuthUser,
    @Body() data: ChangeDisplayNameDto,
  ) {
    return this.userService.updateUserDisplayName(user, data);
  }
}
