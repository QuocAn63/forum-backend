import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from './dto';
import { HashUtil } from '../../utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { UserChangePasswordDto } from './dto/user_changePassword.dto';
import { AuthUser } from './auth.guard';
import { MailSenderService } from '../mailSender/mailSender.service';
import * as moment from 'moment';
import { UserService } from '../user/user.service';
import { LimitedUserTicketService } from '../limitedUserTicket/limitedUserTicket.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => MailSenderService))
    private mailSenderService: MailSenderService,
    private limitedTicketService: LimitedUserTicketService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(userSigninDto: UserLoginDto): Promise<any> {
    const { username, password } = userSigninDto;
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!(await HashUtil.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    await this.userService.updateUserLastLoginTime(user.id);

    const { password: _, id } = user;

    // Get user limited permissions
    await this.limitedTicketService.checkAndUpdateLimitedTime(user);
    const limitedPermissions =
      (await this.limitedTicketService.getCurrentTicket(user))
        ?.limitedPermissions || '';

    const accessToken = await this.jwtService.signAsync({
      username,
      id,
      role: user.role,
      email: user.email,
      limitedPermissions,
    });

    return { message: 'Login success', token: accessToken };
  }

  async createUser(userRegistrationDto: UserRegistrationDto): Promise<any> {
    const { username, email, password, retypedPassword } = userRegistrationDto;
    const url = this.configService.get<string>('APP_URL');

    if (password !== retypedPassword) {
      throw new BadRequestException('Password confirm does not match.');
    }

    const isUsernameAvailable =
      await this.userService.isUsernameAvailable(username);
    if (!isUsernameAvailable) {
      throw new BadRequestException('User already exist.');
    }

    const isEmailAvailable = await this.userService.isEmailAvailable(email);
    if (!isEmailAvailable) {
      throw new BadRequestException('Email already exist.');
    }

    const hashedPassword = await HashUtil.hash(password);

    const newUser = await this.userService.createNewUser(
      username,
      email,
      hashedPassword,
    );

    await this.mailSenderService.sendVerifyMail(newUser, url);
  }

  async verifyUser(user: AuthUser, token: string) {
    if (!token) {
      throw new BadRequestException('Token is empty.');
    }

    const verificationEmailData = await this.mailSenderService.findOne(
      user.id,
      token,
    );

    if (!verificationEmailData) {
      throw new NotFoundException('Token not found');
    }

    const current = moment();
    const isLated = current.isAfter(moment(verificationEmailData.expiredAt));

    if (isLated) {
      throw new BadRequestException('Token expired.');
    }

    await this.userService.updateUserMailVerification(
      verificationEmailData.userId,
      true,
    );

    return `Verified email of ${verificationEmailData.userId}.`;
  }

  async changePassword(changePwDto: UserChangePasswordDto, user: AuthUser) {
    const userResult = await this.userService.findUserByUsername(user.username);

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

    return this.userService.updateUserPassword(
      user,
      await HashUtil.hash(newPassword),
    );
  }
}
