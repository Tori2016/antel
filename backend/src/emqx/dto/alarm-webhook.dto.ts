import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class AlarmWebhookDto {
  @IsNotEmpty()
  @IsObject()
  payload: Payload;
  @IsNotEmpty()
  @IsNumber()
  setPoint: number;
  @IsNotEmpty()
  @IsNumber()
  triggerTime: number;
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsNotEmpty()
  @IsString()
  dId: string;
  @IsNotEmpty()
  @IsString()
  deviceName: string;
  @IsNotEmpty()
  @IsString()
  topic: string;
  @IsNotEmpty()
  @IsString()
  condition: string;
  @IsNotEmpty()
  @IsString()
  variable: string;
  @IsNotEmpty()
  @IsString()
  variableFullName: string;
  @IsNotEmpty()
  @IsString()
  emqxRuleId: string;
  @IsNotEmpty()
  @IsString()
  unit: string;
  @IsNotEmpty()
  @IsString()
  email: string;
}

export interface Payload {
  value: number;
}
