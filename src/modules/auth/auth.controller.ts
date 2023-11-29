import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto, UserLoginDto } from './dto';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { AuthGuard, AuthUser, Public } from './auth.guard';
import { Request } from 'express';
import { User } from './user.decorator';
import { MailSenderService } from '../mailSender/mailSender.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailSenderService: MailSenderService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.authService.validateUser(userLoginDto);
  }

  @Public()
  @Post('register')
  async register(
    @Req() request: Request,
    @Body() UserRegistrationDto: UserRegistrationDto,
  ): Promise<any> {
    return await this.authService.createUser(UserRegistrationDto, request.baseUrl);
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verifyUser(@Query() queries: any) {
    const token = queries['token']

    return this.authService.verifyUser(token)
  }

  @Post('resend')
  @UseGuards(AuthGuard)
  async resendVerifyEmail(@User() user: AuthUser, @Req() request: Request) {
    return await this.mailSenderService.resendVerificationEmail(user, request.baseUrl)
  }

  @Put('changepassword')
  async changePassword(@Body() changePasswordDto: UserChangePasswordDto, @Req() req: Request) {
    return await this.authService.changePassword(changePasswordDto, req['user']['username'])
  }
}
