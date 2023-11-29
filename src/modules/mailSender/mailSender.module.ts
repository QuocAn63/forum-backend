import { Module } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';
import { MailSenderController } from './mailSender.controller';

@Module({
  imports: [],
  providers: [MailSenderService],
  controllers: [MailSenderController],
  exports: [MailSenderModule, MailSenderService],
})
export class MailSenderModule {}
