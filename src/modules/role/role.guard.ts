import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('Roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const permissions = this.reflector.getAllAndMerge<string[]>('Permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const userPerms = request.user.role.permissions as string[];
    const userLimitedPerms = request.user.limitedPermissions as string[];
    const isRoleAllowed = roles.includes(request.user.role.id);
    if (!roles.length) {
      return false;
    }

    if (permissions.length === 0 && isRoleAllowed) {
      return true;
    }

    const isPermAllowed =
      permissions.every((perm) => userPerms.includes(perm)) &&
      !(
        userLimitedPerms &&
        permissions.some((perm) => userLimitedPerms.includes(perm))
      );

    return isRoleAllowed && isPermAllowed;
  }
}
