import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { HashUtil } from '../../utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { AuthUser } from './auth.guard';
import { MailSenderService } from '../mailSender/mailSender.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => MailSenderService))
    private mailSenderService: MailSenderService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userSigninDto: UserLoginDto): Promise<any> {
    const { username, password } = userSigninDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user', 'role.id', 'role.permissions'])
      .where(`user.username = :username`, { username })
      .getOne();

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
    const accessToken = await this.jwtService.signAsync({
      username,
      id,
      role: user.role,
      email: user.email,
    });

    return { message: 'Login success', token: accessToken };
  }

  async createUser(
    userRegistrationDto: UserRegistrationDto,
    domain: string,
  ): Promise<any> {
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
    await this.mailSenderService.sendVerifyMail(newUser, domain);
  }

  async verifyUser(token: string) {
    if (!token) {
      throw new BadRequestException('Token is empty.');
    }

    const verificationEmailData = await this.mailSenderService.findOne(token);

    if (!verificationEmailData) {
      throw new NotFoundException('Token not found');
    }

    const current = moment();
    const isLated = current.isAfter(moment(verificationEmailData.expiredAt));

    if (isLated) {
      throw new BadRequestException('Token expired.');
    }

    await this.userRepository.update(
      {
        id: verificationEmailData.userId,
      },
      {
        isEmailVerified: true,
      },
    );

    return `Verified email of ${verificationEmailData.userId}.`;
  }

  async isEmailVerified(user: AuthUser): Promise<boolean> {
    return (
      await this.userRepository.findOne({ where: { username: user.username } })
    ).isEmailVerified;
  }

  async changePassword(changePwDto: UserChangePasswordDto, user: AuthUser) {
    const userResult = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (!userResult) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword, retypedNewPassword } = changePwDto;

    if (newPassword !== retypedNewPassword) {
      throw new BadRequestException('New password confirm not match.');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password should not same the old password.',
      );
    }

    if (!(await HashUtil.compare(oldPassword, userResult.password))) {
      throw new BadRequestException('Password not match.');
    }

    return (
      await this.userRepository.save({
        ...userResult,
        password: await HashUtil.hash(newPassword),
      })
    ).id;
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
