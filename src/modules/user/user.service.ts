import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/interfaces/base.service';
import { PostService } from '../post/post.service';
import { AuthUser } from '../auth/auth.guard';
import { ChangeDisplayNameDto } from './dto/user_changename.dto';

@Injectable()
export class UserService extends BaseService<User, Repository<User>> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private postService: PostService,
  ) {
    super(userRepository);
  }

  async getUserProfile(username: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserPosts(username: string): Promise<any> {
    return await this.postService.findPostsOfUser(username);
  }

  async findUserByUsername(username: string) {
    return this.repository
      .createQueryBuilder('user')
      .where({ username })
      .leftJoinAndSelect('user.role', 'role')
      .select(['user', 'role.id', 'role.permissions'])
      .getOne();
  }

  async updateUserLastLoginTime(id: string) {
    return this.repository.update(
      { id },
      { lastLoginAt: new Date().toISOString() },
    );
  }

  async createNewUser(username: string, email: string, password: string) {
    return this.repository.save({ username, password, email });
  }

  async updateUserMailVerification(id: string, status: boolean) {
    return this.repository.update({ id }, { isEmailVerified: status });
  }

  async isUserEmailVerified(user: AuthUser) {
    return (
      await this.repository.findOne({ where: { username: user.username } })
    ).isEmailVerified;
  }

  async updateUserPassword(user: AuthUser, password: string) {
    return this.repository.update({ username: user.id }, { password });
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

  async updateUserDisplayName(user: AuthUser, data: ChangeDisplayNameDto) {
    return this.repository.update({ id: user.id }, { displayName: data.name });
  }
}
