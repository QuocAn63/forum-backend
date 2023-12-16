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
import { diskStorage } from 'multer';
import { basename, extname, parse } from 'path';
import { nanoid } from 'nanoid';

@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const avatarStorage = diskStorage({
          destination: configService.getOrThrow("AVATARS_FOLDER"),
          filename: (req, file, cb) => {
            const ext = extname(file.originalname)
            const filename = parse(file.originalname).name.replace(/\s/g, "") + nanoid(6)
    
            cb(null, filename+ext)
          }
        })

        return {
          dest: configService.getOrThrow('AVATARS_FOLDER'),
          storage: avatarStorage
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
