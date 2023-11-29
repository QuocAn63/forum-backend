import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<string>('Role', [
      context.getHandler(),
      context.getClass(),
    ]);
    const permissions = this.reflector.getAllAndMerge<string[]>('Permission', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const perms = request.user.role.permissions.split(',') as string[];
    const isRoleAllowed = role === request.user.role.id;

    if (role === undefined) {
      return false;
    }

    if (permissions.length === 0 && isRoleAllowed) {
      return true;
    }

    const isPermAllowed = permissions.every((perm) => perms.includes(perm));

    return isRoleAllowed && isPermAllowed;
  }
}
