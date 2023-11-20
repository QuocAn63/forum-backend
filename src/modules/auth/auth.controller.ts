import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto, UserLoginDto } from './dto';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.AuthService.validateUser(userLoginDto);
  }

  @Post('register')
  async register(
    @Body() UserRegistrationDto: UserRegistrationDto,
  ): Promise<any> {
    return await this.AuthService.createUser(UserRegistrationDto);
  }

  @Put('changepassword')
  async changePassword(@Body() changePasswordDto: UserChangePasswordDto) {}
}
