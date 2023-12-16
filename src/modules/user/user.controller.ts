import {
  Controller,
  Param,
  Get,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, AuthUser, Public } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { User } from '../auth/user.decorator';
import { ChangeDisplayNameDto } from './dto/user_changename.dto';
import { UpdateUserInformationsDto } from './dto/user_updateInformations.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }

  @Public()
  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.userService.findUserPublicProfile(username);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  getUsers() {
    return this.userService.index();
  }

  @Get(':username/posts')
  getUserPosts(@Param('username') username: string) {
    return this.userService.findUserPosts(username);
  }

  @UseGuards(AuthGuard)
  @Post('updatedisplayname')
  async updateDisplayName(
    @User() user: AuthUser,
    @Body() data: ChangeDisplayNameDto,
  ) {
    return this.userService.updateDisplayName(user, data);
  }

  @UseGuards(AuthGuard)
  @Post('updateinformations')
  async updateInformations(
    @Body() data: UpdateUserInformationsDto,
    @User() user: AuthUser,
  ) {
    return await this.userService.updateInformations(user, data);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('updateavatar')
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(image\/)(jpg|jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @User() user: AuthUser,
  ) {
    return this.userService.updateAvatar(user, file);
  }
}
