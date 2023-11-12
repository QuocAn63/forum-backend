import { Body, Controller, Post } from '@nestjs/common';
import { UserSigninDto } from './dto/user_login.dto';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user_create.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('login')
  async login(@Body() userSigninDto: UserSigninDto): Promise<any> {
    return await this.AuthService.validateUser(userSigninDto);
  }

  @Post('register')
  async register(@Body() UserSignupDto: UserSignupDto): Promise<any> {
    return await this.AuthService.createUser(UserSignupDto);
  }
}
