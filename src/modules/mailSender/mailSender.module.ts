import { Module, forwardRef } from '@nestjs/common';
import { MailSenderService } from './mailSender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { CommentService } from '../comment/comment.service';
import { CommentModule } from '../comment/comment.module';
import { EmailVerificationToken } from './entities/emailVerificationToken.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([User, EmailVerificationToken]),
  ],
  providers: [UserService, MailSenderService, PostService, CommentService],
  controllers: [],
  exports: [MailSenderService],
})
export class MailSenderModule {}
