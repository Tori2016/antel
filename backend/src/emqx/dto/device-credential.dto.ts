import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceCredentialDto {
  @IsNotEmpty()
  @IsString()
  dId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
