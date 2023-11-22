import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { HashUtil } from '../../common/utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(userSigninDto: UserLoginDto): Promise<any> {
    const { username, password } = userSigninDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!(await HashUtil.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    await this.userRepository.save({
      ...user,
      lastLoginAt: new Date().toISOString(),
    });
    const { password: _, id } = user;
    const accessToken = await this.jwtService.signAsync({ username, id });

    return { message: 'Login success', token: accessToken };
  }

  async createUser(userRegistrationDto: UserRegistrationDto): Promise<any> {
    const { username, email, password, retypedPassword } = userRegistrationDto;

    if (password !== retypedPassword) {
      throw new BadRequestException('Password confirm does not match.');
    }

    const isUsernameAvailable = await this.isUsernameAvailable(username);
    if (!isUsernameAvailable) {
      throw new BadRequestException('User already exist.');
    }

    const isEmailAvailable = await this.isEmailAvailable(email);
    if (!isEmailAvailable) {
      throw new BadRequestException('Email already exist.');
    }

    const hashedPassword = await HashUtil.hash(password);

    const newUser = this.userRepository.create({
      ...userRegistrationDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
  }

  async changePassword(changePwDto: UserChangePasswordDto, username: string) {
    const user = await this.userRepository.findOne({where: {username}})    
    if(!user) {
      throw new NotFoundException('User not found')
    }
    
    const { oldPassword, newPassword, retypedNewPassword} = changePwDto
    
    if(newPassword !== retypedNewPassword) {
      throw new BadRequestException('New password confirm not match.')
    }
    
    if(oldPassword === newPassword) {
      throw new BadRequestException('New password should not same the old password.')
    }

    if(!await HashUtil.compare(oldPassword, user.password)) {
      throw new BadRequestException('Password not match.')
    }

    return  (await this.userRepository.save({...user, password: await HashUtil.hash(newPassword)})).id
  }

  private async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['username'],
    });

    return user === null;
  }

  private async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email'],
    });

    return user === null;
  }
}
