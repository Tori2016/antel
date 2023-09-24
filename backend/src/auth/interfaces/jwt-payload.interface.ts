import { ValidRoles } from '../../common/interfaces';

export interface JwtPayload {
  sub: string;
  role: ValidRoles;
}
