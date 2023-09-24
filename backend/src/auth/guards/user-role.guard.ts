import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protected.decorator';

import { HandleError } from '../../utils';
import { User } from '../../users/entities/user.schema';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    try {
      if (!validRoles) return true;
      if (validRoles.length === 0) return true;

      const req = context.switchToHttp().getRequest();
      const user = req.user as User;

      if (!user) {
        throw new HandleError({
          type: 'FORBIDDEN',
          message: 'USER_NOT_FOUND',
        });
      } else if (!validRoles.includes(user.role)) {
        throw new HandleError({
          type: 'FORBIDDEN',
          message: 'ROLE_INVALID',
        });
      }
      return true;
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }
}
