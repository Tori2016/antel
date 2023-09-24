import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatasService } from './datas.service';
import { DatasController } from './datas.controller';
import { Data, DataSchema } from './entities/data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  controllers: [DatasController],
  providers: [DatasService],
  exports: [MongooseModule],
})
export class DatasModule {}
