import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user_login.dto';
import { UserCreateDto } from './dto/user_create.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { HashUtil } from '../../common/utils/hash.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(userSigninDto: UserLoginDto): Promise<any> {
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
    const { password: _, id } = user;
    const accessToken = await this.jwtService.signAsync({username, id}, {expiresIn: ""})
    return {token: accessToken};
  }

  async createUser(userCreateDto: UserCreateDto): Promise<any> {
    const { username, password, retypedPassword } = userCreateDto;

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
      ...userCreateDto,
      password: hashedPassword,
    });

    await this.authRepository.save(newUser);
  }
}
