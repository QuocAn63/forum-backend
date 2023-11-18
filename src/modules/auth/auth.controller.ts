import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserCreateDto, UserLoginDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.AuthService.validateUser(userLoginDto);
  }

  @Post('register')
  async register(@Body() UserCreateDto: UserCreateDto): Promise<any> {
    return await this.AuthService.createUser(UserCreateDto);
  }
}
