import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthrulesService } from '../services';
import { Auth, GetUser } from '../../auth/decorators';
import { ParseMongoIdPipe } from '../../common/pipes';
import { DeviceCredentialDto } from '../dto';

@Controller('authrules')
export class AuthrulesController {
  constructor(private readonly authrulesService: AuthrulesService) {}

  @Get('web-credentials')
  @Auth()
  @HttpCode(HttpStatus.OK)
  getWebCredentials(
    @Res() res: Response,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.authrulesService.webCredentials(userId, res);
  }

  @Get('web-credentials-reconnect')
  @Auth()
  @HttpCode(HttpStatus.OK)
  getWebCredentialsReconnect(
    @Res() res: Response,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.authrulesService.webCredentialsReconnect(userId, res);
  }

  @Post('device-credentials')
  @HttpCode(HttpStatus.OK)
  getDeviceCredentials(
    @Body() deviceCredentialDto: DeviceCredentialDto,
    @Res() res: Response,
  ) {
    return this.authrulesService.deviceCredentilas(deviceCredentialDto, res);
  }
}
