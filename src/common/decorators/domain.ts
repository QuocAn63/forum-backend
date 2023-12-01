import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { URL } from 'url';

export const Domain = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return new URL(request.url, `${request.protocol}:${request.headers.host}`);
  },
);
