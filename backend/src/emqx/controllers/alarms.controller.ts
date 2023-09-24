import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';

import { AlarmRuleDto } from '../dto/alarm-rule.dto';

import { AlarmsService } from '../services';
import { Auth, GetUser } from '../../auth/decorators';
import { ParseMongoIdPipe } from '../../common/pipes';
import { UpdateAlarmruleDto } from '../dto';

@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Post()
  @Auth()
  createAlarmRule(
    @GetUser('id', ParseMongoIdPipe) userId: string,
    @Body() alarmRuleDto: AlarmRuleDto,
  ) {
    return this.alarmsService.createAlarmRule(userId, alarmRuleDto);
  }

  @Delete(':emqxRuleId')
  @Auth()
  deleteAlarmRule(@Param('emqxRuleId') emqxRuleId: string) {
    return this.alarmsService.deleteAlarmRule(emqxRuleId);
  }

  @Put(':emqxRuleId')
  @Auth()
  updateAlarmRule(
    @Param('emqxRuleId') emqxRuleId: string,
    @Body() updateAlarmruleDto: UpdateAlarmruleDto,
  ) {
    return this.alarmsService.updateAlarmRule(emqxRuleId, updateAlarmruleDto);
  }
}
