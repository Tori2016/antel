import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AlarmRuleDto {
  @IsNotEmpty()
  @IsString()
  dId: string;
  @IsNotEmpty()
  @IsString()
  deviceName: string;
  @IsNotEmpty()
  @IsString()
  variableFullName: string;
  @IsNotEmpty()
  @IsString()
  variable: string;
  @IsNotEmpty()
  @IsString()
  unit: string;
  @IsNotEmpty()
  @IsString()
  condition: string;
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
  @IsNotEmpty()
  @IsNumber()
  setPoint: number;
  @IsNotEmpty()
  @IsNumber()
  triggerTime: number;
}
