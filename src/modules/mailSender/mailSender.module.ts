import { Module, forwardRef } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';
import { MailSenderController } from './mailSender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationToken } from 'src/common/entities/emailVerificationToken.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, EmailVerificationToken]),
  ],
  providers: [AuthService, MailSenderService],
  controllers: [MailSenderController],
  exports: [MailSenderModule, MailSenderService],
})
export class MailSenderModule {}
