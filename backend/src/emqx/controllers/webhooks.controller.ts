import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { WebhooksService } from '../services';
import { AlarmWebhookDto, SaveWebhookDto } from '../dto';
import { Auth, GetUser } from '../../auth/decorators';
import { ParseMongoIdPipe } from '../../common/pipes';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('save')
  saveWebhook(@Req() req: Request, @Body() saveWebhookDto: SaveWebhookDto) {
    return this.webhooksService.saveWebhook(saveWebhookDto, req);
  }

  @Post('alarm')
  alarmWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() alarmWebhookDto: AlarmWebhookDto,
  ) {
    return this.webhooksService.alarmWebhook(alarmWebhookDto, req, res);
  }

  @Get('notifications')
  @Auth()
  getNotifications(@GetUser('id', ParseMongoIdPipe) userId: string) {
    return this.webhooksService.getNotifications(userId);
  }

  @Get('notifications/:notifId')
  @Auth()
  readNotifications(
    @Param('notifId', ParseMongoIdPipe) notifId: string,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.webhooksService.readNotifications(userId, notifId);
  }
}
