import { UseGuards, applyDecorators } from '@nestjs/common';

import { AtGuard, UserRoleGuard } from '../guards';
import { RoleProtected } from './';
import { ValidRoles } from '../../common/interfaces';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AtGuard, UserRoleGuard),
  );
}
