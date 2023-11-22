import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto, UserLoginDto } from './dto';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Put('changepassword')
  async changePassword(@Body() changePasswordDto: UserChangePasswordDto, @Request() req: Request) {
    return await this.authService.changePassword(changePasswordDto, req['user']['username'])
  }
}
