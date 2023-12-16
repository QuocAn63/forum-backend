import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { NotificationModule } from '../notification/notification.module';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dest: configService.getOrThrow('AVATARS_FOLDER'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
