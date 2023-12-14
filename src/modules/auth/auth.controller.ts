import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto, UserLoginDto } from './dto';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { AuthGuard, AuthUser, Public } from './auth.guard';
import { User } from './user.decorator';
import { MailSenderService } from '../mailSender/mailSender.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailSenderService: MailSenderService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.authService.validateUser(userLoginDto);
  }

  @Public()
  @Post('register')
  async register(
    @Body() UserRegistrationDto: UserRegistrationDto,
  ): Promise<any> {
    return await this.authService.createUser(UserRegistrationDto);
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verifyUser(@Query() queries: any, @User() user: AuthUser) {
    const token = queries['token'];

    return this.authService.verifyUser(user, token);
  }

  @Post('resend')
  @UseGuards(AuthGuard)
  async resendVerifyMail(@User() user: AuthUser) {
    return await this.mailSenderService.resendVerificationMail(user);
  }

  @Put('changepassword')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: UserChangePasswordDto,
    @User() user: AuthUser,
  ) {
    return await this.authService.changePassword(changePasswordDto, user);
  }
}
