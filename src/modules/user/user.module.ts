import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '../../common/entities/role.entity';
import { UserBookmark } from 'src/common/entities/userBookmark';
import { Post } from 'src/common/entities/post.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserBookmark, Post])],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
