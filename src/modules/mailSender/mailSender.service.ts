import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailSenderService {
  private transporter: Mail;

  constructor(private configService: ConfigService) {
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
      throw err;
    }
  }

  async sendVerifyMail(username: string) {}
}
