import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { HandleError } from '../../utils';
import { User } from '../../users/entities/user.schema';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET_ACCESS'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const { sub } = payload;

      const user: User = await this.userModel.findById(
        sub,
        '-createdAt -updatedAt -avatar -phone',
      );

      if (!user) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'USER_NOT_FOUND',
        });
      } else if (!user.isActive) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'USER_INACTIVE',
        });
      }
      return user;
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }
}
