import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Model } from 'mongoose';

import { ForgotPassDto, LoginAuthDto, UpdatePassDto } from './dto';

import { Tokens, authResult } from './types';
import { HandleError, compareHash, generateHash, makeId } from '../utils';

import { User } from '../users/entities/user.schema';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async login(res: Response, loginAuthDto: LoginAuthDto): Promise<authResult> {
    const { email, password } = loginAuthDto;

    try {
      const user = await this.userModel.findOne({ email }, '+password');

      if (!user) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'USER_NOT_FOUND',
        });
      } else if (!user.isVerified) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'USER_UNVERIFIED',
        });
      } else if (!user.isActive) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'USER_INACTIVE',
        });
      }

      const isCheck = await compareHash(password, user.password);
      if (!isCheck) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'INVALID_CREDENTIALS',
        });
      }

      const userFlat = user.toObject();
      delete userFlat.password;

      const tokens = await this.getTokens({ sub: user.id, role: user.role });
      await this.updateRefreshToken(res, tokens.refresh_token);

      return {
        user: userFlat,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
      };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('refresh_token');
      return { message: 'USER_LOGOUT' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async refreshTokens(
    res: Response,
    id: string,
    rt: string,
  ): Promise<authResult> {
    try {
      const user = await this.userModel.findById(id);

      if (!user || !user.isActive || !rt) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'TOKEN_NOT_VALID',
        });
      }

      const userFlat = user.toObject();
      delete userFlat.password;

      const tokens = await this.getTokens({ sub: user.id, role: user.role });
      await this.updateRefreshToken(res, tokens.refresh_token);

      return {
        user: userFlat,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
      };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async verifyAccount(token: string) {
    try {
      const varifyUser = await this.userModel.findOneAndUpdate(
        { token },
        { isVerified: true, isActive: true, token: '' },
      );

      if (!varifyUser) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TOKEN_INVALID',
        });
      }

      return { message: 'ACCOUNT_VERIFIED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async forgotPassword(forgotPassDto: ForgotPassDto) {
    const { email } = forgotPassDto;
    const token = await makeId(40);
    const tokenExpires = Date.now() + 600000;

    try {
      const user = await this.userModel.findOneAndUpdate(
        { email },
        { token, tokenExpires },
        { new: true },
      );

      if (!user) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TOKEN_NOT_SEND',
        });
      }

      this.eventEmitter.emit('forgot-password', user);

      return { message: 'SEND_TOKEN' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async verifyToken(token: string) {
    const timeNow = Date.now();

    try {
      const isValidToken = await this.userModel.findOne({ token });

      if (!isValidToken) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TOKEN_INVALID',
        });
      } else if (timeNow > isValidToken.tokenExpires) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TOKEN_INVALID',
        });
      }

      return { message: 'TOKEN_VALID' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async forgotPasswordToken(token: string, { password }: ForgotPassDto) {
    try {
      const updatePassword = await this.userModel.findOneAndUpdate(
        { token },
        { password: await generateHash(password), tokenExpires: 0, token: '' },
      );

      if (!updatePassword) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'PASSWORD_NOT_UPDATED',
        });
      }

      return { message: 'PASSWORD_UPDATED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async updatePassword(
    id: string,
    { oldPassword, newPassword }: UpdatePassDto,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: id }, '+password');

      const isCheck = await compareHash(oldPassword, user.password);
      if (!isCheck) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'INVALID_CREDENTIALS',
        });
      }

      const updatedPass = await this.userModel.updateOne(
        { _id: id },
        { password: await generateHash(newPassword) },
      );

      if (updatedPass.modifiedCount == 0 && updatedPass.matchedCount == 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'PASSWORD_NOT_UPDATED',
        });
      }

      return { message: 'PASSWORD_UPDATED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  // F U N T I O N S
  private async updateRefreshToken(res: Response, rt: string) {
    const expiresCookie = 1000 * 60 * 60 * 24 * 7;

    res.cookie('refresh_token', rt, {
      httpOnly: true,
      secure: !(this.configService.get('NODE_ENV') === 'development'),
      expires: new Date(Date.now() + expiresCookie),
    });
  }

  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    const expiresIn =
      this.configService.get('NODE_ENV') === 'development'
        ? 60 * 60 * 24 * 15
        : 60 * 15;

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_ACCESS'),
        expiresIn: expiresIn,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH'),
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
      expires_in: expiresIn,
    };
  }
}
