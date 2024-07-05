import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import RolePermission from '../../common/constant/role-permission.constant';


@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userPermissions = RolePermission[user.roles];

    const isAccess = requiredPermissions.every(permission => userPermissions.includes(permission));
    if (!isAccess) {
      throw new ForbiddenException('Forbidden: Not have permissions access!');
    }

    return true;
  }
}