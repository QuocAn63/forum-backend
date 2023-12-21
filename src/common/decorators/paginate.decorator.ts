import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Paginate = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const page = request.params.page || 1;
    const pageSize = request.params.pageSize || 20;

    return { page, pageSize };
  },
);
