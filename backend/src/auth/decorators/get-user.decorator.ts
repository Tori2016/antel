import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { HandleError } from '../../utils';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      const req = ctx.switchToHttp().getRequest();
      const user = req.user;
      if (!user) {
        throw new HandleError({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'USER_NOT_FOUND_REQUEST',
        });
      }
      return !data ? user : user[data];
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  },
);
