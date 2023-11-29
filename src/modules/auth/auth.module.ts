import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailSenderService } from '../mailSender/mailSender.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  providers: [AuthService, MailSenderService],
  controllers: [AuthController],
})
export class AuthModule {}
