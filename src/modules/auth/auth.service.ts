import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSigninDto } from './dto/user_login.dto';
import { UserSignupDto } from './dto/user_create.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { HashUtil } from '../../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
  ) {}

  async validateUser(userSigninDto: UserSigninDto): Promise<any> {
    const { username, password } = userSigninDto;
    const user = await this.authRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!(await HashUtil.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    await this.authRepository.save({
      ...user,
      lastLoginAt: new Date().toISOString(),
    });
    const { password: _, ...userResponse } = user;

    return userResponse;
  }

  async createUser(userSignupDto: UserSignupDto): Promise<any> {
    const { username, password, retypedPassword } = userSignupDto;

    const isUserExists = await this.authRepository.findOne({
      where: { username },
    });

    if (isUserExists) {
      throw new BadRequestException('The username already exists.');
    }

    if (password !== retypedPassword) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    const hashedPassword = await HashUtil.hash(password);

    const newUser = this.authRepository.create({
      ...userSignupDto,
      password: hashedPassword,
    });

    await this.authRepository.save(newUser);
  }
}
