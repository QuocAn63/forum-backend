import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../interfaces/base.service';
import { Repository } from 'typeorm';
import { AuthUser } from '../auth/auth.guard';
import * as moment from 'moment';
import { CreateLimitedUserTicketDto } from './dto/limitedUserTicket_create.dto';
import { PermissionService } from '../permission/permission.service';
import { LimitedUserTicket } from './entities/limitedUserTicket.entity';

@Injectable()
export class LimitedUserTicketService extends BaseService<
  LimitedUserTicket,
  Repository<LimitedUserTicket>
> {
  constructor(
    @InjectRepository(LimitedUserTicket)
    limitedTicketRepo: Repository<LimitedUserTicket>,
    private permissionService: PermissionService,
  ) {
    super(limitedTicketRepo);
  }

  async createNewTicket(id: string, data: CreateLimitedUserTicketDto) {
    const permissions = (
      await this.permissionService.getListOfActivePermissions(data.permissions)
    ).join(',');

    const amount = new RegExp(/\d+/).exec(data.expiredIn)[0];
    const unit = new RegExp(/[hdwm]/).exec(data.expiredIn)[0];

    const expiredIn = moment()
      .add(amount, unit as moment.unitOfTime.DurationConstructor)
      .format();

    return this.repository.save({
      user: { id },
      endAt: expiredIn,
      limitedPermissions: permissions,
    });
  }

  async getCurrentTicket(data: string): Promise<any>;
  async getCurrentTicket(data: AuthUser): Promise<any>;
  async getCurrentTicket(data: any): Promise<any> {
    const query =
      typeof data === 'string'
        ? {
            where: { user: { id: data }, isExpired: false },
          }
        : 'id' in data
        ? {
            where: { user: { id: data.id }, isExpired: false },
          }
        : undefined;

    return this.repository.findOne(query);
  }

  async checkAndUpdateLimitedTime(user: AuthUser) {
    const current = moment();
    const ticket = await this.getCurrentTicket(user);

    if (!ticket) {
      return;
    }

    const isExpired = current.isAfter(moment(ticket.endAt));

    if (isExpired) {
      await this.repository.update({ id: ticket.id }, { isExpired: true });
    }
  }
}
