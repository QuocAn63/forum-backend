import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/entities/role.entity';
import { BaseService } from 'src/interfaces/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends BaseService<Role, Repository<Role>> {
  constructor(@InjectRepository(Role) roleRepository: Repository<Role>) {
    super(roleRepository);
  }
}
