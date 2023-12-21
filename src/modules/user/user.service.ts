import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../interfaces/base.service';
import { PostService } from '../post/post.service';
import { AuthUser } from '../auth/auth.guard';
import { ChangeDisplayNameDto } from './dto/user_changename.dto';
import { User } from './entities/user.entity';
import { UpdateUserInformationsDto } from './dto/user_updateInformations.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { PaginateMetadata } from 'src/interfaces/response.interface';

@Injectable()
export class UserService extends BaseService<User, Repository<User>> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private postService: PostService,
  ) {
    super(userRepository);
  }

  async findUserPublicProfile(username: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, roleId, isEmailVerified, ...publicInfo } = user;

    return publicInfo;
  }

  findUserPosts(username: string, paginate: PaginateMetadata): Promise<any> {
    return this.postService.findPostsOfUser(username, paginate);
  }

  findUserByUsername(username: string) {
    return this.repository
      .createQueryBuilder('user')
      .where({ username })
      .leftJoinAndSelect('user.role', 'role')
      .select(['user', 'role.id', 'role.permissions'])
      .getOne();
  }

  createNewUser(data: UserCreateDto) {
    const { email, password, username } = data;
    return this.repository.save({ username, password, email });
  }

  updateInformations(
    user: AuthUser,
    data: UpdateUserInformationsDto,
  ): Promise<any> {
    if (!Object.keys(data).length) {
      throw new BadRequestException('Nothing to update.');
    }

    return this.repository.update({ id: user.id }, { ...data });
  }

  updateLastLoginTime(id: string) {
    return this.repository.update(
      { id },
      { lastLoginAt: new Date().toISOString() },
    );
  }

  updateMailVerification(id: string, status: boolean) {
    return this.repository.update({ id }, { isEmailVerified: status });
  }

  updatePassword(user: AuthUser, password: string) {
    return this.repository.update({ username: user.id }, { password });
  }

  updateDisplayName(user: AuthUser, data: ChangeDisplayNameDto) {
    return this.repository.update({ id: user.id }, { displayName: data.name });
  }

  updateAvatar(user: AuthUser, file: Express.Multer.File) {
    const { filename } = file;

    return this.repository.update({ id: user.id }, { avatar: filename });
  }

  async isUserEmailVerified(user: AuthUser) {
    return (
      await this.repository.findOne({ where: { username: user.username } })
    ).isEmailVerified;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const userResult = await this.repository.findOne({
      where: { username },
      select: ['username'],
    });

    return userResult === null;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const userResult = await this.repository.findOne({
      where: { email },
      select: ['email'],
    });

    return userResult === null;
  }
}
