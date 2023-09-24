import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Template, TemplateSchema } from './entities/template.schema';

import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
    forwardRef(() => DevicesModule),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [MongooseModule],
})
export class TemplatesModule {}
