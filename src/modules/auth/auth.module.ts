import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

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
  providers: [{provide: APP_GUARD, useClass: AuthGuard},AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
