import { Controller, Get } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';

@Controller('mail')
export class MailSenderController {
  constructor(private mailSenderSerivce: MailSenderService) {}

  @Get('test')
  async testSendingMail() {
    await this.mailSenderSerivce.sendTestMail();
  }
}
