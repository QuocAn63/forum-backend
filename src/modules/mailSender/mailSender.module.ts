import { Module, forwardRef } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';
import { MailSenderController } from './mailSender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationToken } from 'src/common/entities/emailVerificationToken.entity';
import { User } from 'src/common/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { CommentService } from '../comment/comment.service';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([User, EmailVerificationToken]),
  ],
  providers: [UserService, MailSenderService, PostService, CommentService],
  controllers: [MailSenderController],
  exports: [MailSenderModule, MailSenderService],
})
export class MailSenderModule {}
