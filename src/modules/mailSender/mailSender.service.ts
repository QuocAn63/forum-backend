import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import {nanoid  } from 'nanoid';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailVerificationToken } from '../../common/entities/emailVerificationToken.entity';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { verificationEmailHtml } from './templates/verification.html';
import { AuthUser } from '../auth/auth.guard';

@Injectable()
export class MailSenderService {
  private transporter: Mail;

  constructor(@InjectRepository(EmailVerificationToken) private emailVerificationTokenRepo: Repository<EmailVerificationToken>, private configService: ConfigService) {
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

  async sendVerifyEmail(user: AuthUser, domain: string) {
    const token = await this.createEmailVerificationToken(user)
    const verificationLink = `${domain}?token=${token}`
    const mailContent = verificationEmailHtml.replace("[REDIRECT_URL]", verificationLink)
    const target = {
      from: this.configService.get("EMAIL_FROM"),
      to: user.email,
      subject: "Account verification",
      html: mailContent
    }

    try {
      await this.transporter.sendMail(target)
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException("Error when sending verification email.")
    }
  }

  async createEmailVerificationToken(user: AuthUser): Promise<string> {
    const emailVerificationToken = nanoid()
    const timeVerifyTo = moment().add(5, "minutes");

    const verificationEmail = this.emailVerificationTokenRepo.create({
      userId: user.id,
      token: emailVerificationToken,
      expiredAt: timeVerifyTo.toISOString()
    })

    return (await verificationEmail.save()).token
  }

  async resendVerificationEmail(user: AuthUser, domain: string) {
    await this.emailVerificationTokenRepo.delete({userId: user.id})
    await this.sendVerifyEmail(user, domain)
  }

  async findOne(token: string) {
    return this.emailVerificationTokenRepo.findOneBy({token})
  }
}
