import { User } from '../../users/entities/user.schema';

export type authResult = {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};
