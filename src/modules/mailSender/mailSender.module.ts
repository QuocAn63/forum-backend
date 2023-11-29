import { Module } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';
import { MailSenderController } from './mailSender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationToken } from 'src/common/entities/emailVerificationToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationToken])],
  providers: [MailSenderService],
  controllers: [MailSenderController],
  exports: [MailSenderModule, MailSenderService],
})
export class MailSenderModule {}
