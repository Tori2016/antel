import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

import { Device, DeviceSchema } from './entities/device.schema';
import { TemplatesModule } from '../templates/templates.module';
import { EmqxModule } from '../emqx/emqx.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    forwardRef(() => TemplatesModule),
    forwardRef(() => EmqxModule),
    HttpModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [MongooseModule],
})
export class DevicesModule {}
