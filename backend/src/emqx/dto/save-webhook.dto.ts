import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SaveWebhookDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsObject()
  payload: Payload;

  @IsNotEmpty()
  @IsString()
  topic: string;
}

interface Payload {
  type: string;
  lat?: number;
  lng?: number;
  value?: number;
  save: number;
}
