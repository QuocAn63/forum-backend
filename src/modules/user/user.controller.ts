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
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate } from 'src/common/decorators/paginate.decorator';
import { PaginateMetadata } from 'src/interfaces/response.interface';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'Find user profile.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Public()
  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.userService.findUserPublicProfile(username);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Find users.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  getUsers(@Paginate() paginate: PaginateMetadata) {
    return this.userService.index(paginate.page, paginate.pageSize);
  }

  @ApiOkResponse({ description: "Find user's posts." })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Get(':username/posts')
  getUserPosts(
    @Param('username') username: string,
    @Paginate() paginate: PaginateMetadata,
  ) {
    return this.userService.findUserPosts(username, paginate);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update user display name.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @UseGuards(AuthGuard)
  @Post('updatedisplayname')
  updateDisplayName(
    @User() user: AuthUser,
    @Body() data: ChangeDisplayNameDto,
  ) {
    return this.userService.updateDisplayName(user, data);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update user informations.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @UseGuards(AuthGuard)
  @Post('updateinformations')
  async updateInformations(
    @Body() data: UpdateUserInformationsDto,
    @User() user: AuthUser,
  ) {
    return await this.userService.updateInformations(user, data);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update/upload user avatar.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
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
