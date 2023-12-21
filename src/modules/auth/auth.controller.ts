import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { AuthGuard, AuthUser, Public } from './auth.guard';
import { User } from './user.decorator';
import { MailSenderService } from '../mailSender/mailSender.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserLoginDto } from './dto/user_login.dto';
import { UserRegistrationDto } from './dto/user_create.dto';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailSenderService: MailSenderService,
  ) {}

  @Public()
  @ApiOkResponse({ description: 'Login successed. Return user token.' })
  @ApiForbiddenResponse({ description: 'Validation failed.' })
  @ApiNotFoundResponse({ description: 'Login failed. User not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.authService.validateUser(userLoginDto);
  }

  @Public()
  @ApiCreatedResponse({
    description: 'Registration successed. Verification email sent.',
  })
  @ApiBadRequestResponse({
    description:
      'Password confirm does not match, user already exist, email already exist.',
  })
  @ApiForbiddenResponse({ description: 'Validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post('register')
  async register(
    @Body() UserRegistrationDto: UserRegistrationDto,
  ): Promise<any> {
    return await this.authService.createUser(UserRegistrationDto);
  }

  @Get('verify')
  @ApiOkResponse({ description: 'User email verified.' })
  @ApiBadRequestResponse({ description: 'Token is empty.' })
  @ApiNotFoundResponse({ description: 'Token not found.' })
  @ApiForbiddenResponse({ description: 'Token expired.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async verifyUser(@Query('token') token: string, @User() user: AuthUser) {
    return this.authService.verifyUser(user, token);
  }

  @ApiOkResponse({ description: 'Verification email sent.' })
  @ApiBadRequestResponse({ description: 'Email verified.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Post('resend')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async resendVerifyMail(@User() user: AuthUser) {
    return await this.mailSenderService.resendVerificationMail(user);
  }

  @ApiOkResponse({ description: 'User password updated.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @Patch('changepassword')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: UserChangePasswordDto,
    @User() user: AuthUser,
  ) {
    return await this.authService.changePassword(changePasswordDto, user);
  }
}
