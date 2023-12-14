import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { nanoid } from 'nanoid';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { Repository } from 'typeorm';
import { verificationEmailHtml } from './templates/verification.html';
import { AuthUser } from '../auth/auth.guard';
import { UserService } from '../user/user.service';
import { EmailVerificationToken } from './entities/emailVerificationToken.entity';

@Injectable()
export class MailSenderService {
  private transporter: Mail;

  constructor(
    @InjectRepository(EmailVerificationToken)
    private emailVerificationTokenRepo: Repository<EmailVerificationToken>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private configService: ConfigService,
  ) {
    this.transporter = createTransport({
      auth: {
        user: configService.getOrThrow('EMAIL_USERNAME'),
        pass: configService.getOrThrow('EMAIL_PASSWORD'),
      },
      service: 'Gmail',
    });
  }

  async sendTestMail() {
    const target = {
      from: 'Test Service',
      to: 'caoan632002@gmail.com',
      subject: 'Mail testing',
      text: 'Test sending email',
    };

    try {
      await this.transporter.sendMail(target);
    } catch (err) {
      console.log(err);
    }
  }

  async sendVerifyMail(user: AuthUser, originDomain: string) {
    const token = await this.createEmailVerificationToken(user);
    const verificationLink = `${originDomain}/api/auth/verify?token=${token}`;
    const mailContent = verificationEmailHtml.replace(
      '[REDIRECT_URL]',
      verificationLink,
    );
    const target = {
      from: this.configService.get('EMAIL_FROM'),
      to: user.email,
      subject: 'Account verification',
      html: mailContent,
    };

    try {
      await this.transporter.sendMail(target);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Error when sending verification email.',
      );
    }
  }

  private async createEmailVerificationToken(user: AuthUser): Promise<string> {
    const emailVerificationToken = nanoid();
    const timeVerifyTo = moment().add(5, 'minutes');

    const verificationEmail = this.emailVerificationTokenRepo.create({
      userId: user.id,
      token: emailVerificationToken,
      expiredAt: timeVerifyTo.toISOString(),
    });

    return (await verificationEmail.save()).token;
  }

  async resendVerificationMail(user: AuthUser) {
    const isEmailVerified = await this.userService.isUserEmailVerified(user);
    const url = this.configService.get<string>('APP_URL');

    if (isEmailVerified) {
      throw new BadRequestException("User's email is already verified.");
    }

    await this.emailVerificationTokenRepo.delete({ userId: user.id });
    await this.sendVerifyMail(user, url);
  }

  async findOne(userId: string, token: string) {
    return this.emailVerificationTokenRepo.findOneBy({ userId, token });
  }
}
