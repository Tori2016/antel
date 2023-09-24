import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Data } from './entities/data.schema';
import { ChartDataDto } from './dto/chart-data.dto';

@Injectable()
export class DatasService {
  constructor(
    @InjectModel(Data.name)
    private readonly dataModel: Model<Data>,
  ) {}

  async getChartDatas(userId: string, chartData: ChartDataDto) {
    const { dId, variable, chartTimeAgo } = chartData;

    try {
      const timeAgoMs = Date.now() - chartTimeAgo * 60 * 1000;

      const data = await this.dataModel
        .find({
          userId,
          dId,
          variable,
          time: { $gt: timeAgoMs },
        })
        .sort({ time: 1 });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getReportDatas(userId: string, chartData: ChartDataDto) {
    const { dId, variable } = chartData;

    try {
      const datas = await this.dataModel.find({
        userId,
        dId,
        variable,
      });

      return datas;
    } catch (error) {
      console.log(error);
    }
  }
}
