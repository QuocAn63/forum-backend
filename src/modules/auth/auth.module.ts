import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailSenderModule } from '../mailSender/mailSender.module';
import { UserModule } from '../user/user.module';
import { LimitedUserTicketModule } from '../limitedUserTicket/limitedUserTicket.module';

@Module({
  imports: [
    forwardRef(() => MailSenderModule),
    forwardRef(() => UserModule),
    LimitedUserTicketModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('AUTH_SECRET'),
        signOptions: {
          expiresIn: '7 days',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}
