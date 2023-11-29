import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/interfaces/base.service';

@Injectable()
export class UserService extends BaseService<User, Repository<User>> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async getUserProfile(username: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...userReponse } = user;

    return userReponse;
  }
}
