import { Controller, Get, Query } from '@nestjs/common';
import { DatasService } from './datas.service';

import { Auth, GetUser } from '../auth/decorators';
import { ParseMongoIdPipe } from '../common/pipes';
import { ChartDataDto } from './dto/chart-data.dto';

@Controller('datas')
export class DatasController {
  constructor(private readonly datasService: DatasService) {}

  @Get('get-small-charts')
  @Auth()
  getChartDatas(
    @Query() chartData: ChartDataDto,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.datasService.getChartDatas(userId, chartData);
  }
  @Get('reports')
  @Auth()
  getReportDatas(
    @Query() chartData: ChartDataDto,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.datasService.getReportDatas(userId, chartData);
  }
}
