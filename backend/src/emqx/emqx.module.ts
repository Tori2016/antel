import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import {
  AlarmsController,
  AuthrulesController,
  WebhooksController,
} from './controllers';
import {
  AlarmsService,
  ApiService,
  AuthrulesService,
  WebhooksService,
} from './services';
import {
  Alarmrule,
  AlarmruleSchema,
  Authrule,
  AuthruleSchema,
  Notification,
  NotificationSchema,
  Saverule,
  SaveruleSchema,
} from './entities';
import { DevicesModule } from '../devices/devices.module';
import { DatasModule } from '../datas/datas.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Saverule.name, schema: SaveruleSchema },
    ]),
    MongooseModule.forFeature([
      { name: Alarmrule.name, schema: AlarmruleSchema },
    ]),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    MongooseModule.forFeature([
      { name: Authrule.name, schema: AuthruleSchema },
    ]),
    forwardRef(() => DevicesModule),
    HttpModule,
    DatasModule,
    TemplatesModule,
  ],
  controllers: [WebhooksController, AlarmsController, AuthrulesController],
  providers: [WebhooksService, AlarmsService, ApiService, AuthrulesService],
  exports: [MongooseModule, AuthrulesService],
})
export class EmqxModule {}
