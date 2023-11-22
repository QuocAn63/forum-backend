import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm';
import { Permission } from 'src/common/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/interfaces/base.service';
import { PermissionCreateDto } from './dto/permission_create.dto';

@Injectable()
export class PermissionService extends BaseService<Permission, Repository<Permission>>{
    constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {
        super(permissionRepository)
    }
}