import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { authResult } from './types';
import { ForgotPassDto, LoginAuthDto, UpdatePassDto } from './dto';

import { RtGuard } from './guards';
import { ParseMongoIdPipe } from '../common/pipes';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() authDto: LoginAuthDto,
  ): Promise<authResult> {
    return this.authService.login(response, authDto);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(RtGuard)
  @Get('refresh')
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser('sub', ParseMongoIdPipe) id: string,
  ): Promise<authResult> {
    const refreshToken = req.cookies.refresh_token;
    return this.authService.refreshTokens(res, id, refreshToken);
  }

  @Get('verify-account/:token')
  verifyAccount(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPassDto: ForgotPassDto) {
    return this.authService.forgotPassword(forgotPassDto);
  }

  @Get('forgot-password/:token')
  verifyToken(@Param('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('forgot-password/:token')
  forgotPasswordToken(
    @Param('token') token: string,
    @Body() forgotPassDto: ForgotPassDto,
  ) {
    return this.authService.forgotPasswordToken(token, forgotPassDto);
  }

  @Patch('update-password')
  @Auth()
  updatePassword(
    @GetUser('id', ParseMongoIdPipe) id: string,
    @Body() updatePassDto: UpdatePassDto,
  ) {
    return this.authService.updatePassword(id, updatePassDto);
  }
}
