import { PartialType } from '@nestjs/mapped-types';
import { AlarmRuleDto } from './alarm-rule.dto';

export class UpdateAlarmruleDto extends PartialType(AlarmRuleDto) {}
