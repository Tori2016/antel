import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSaveruleDto {
  @IsNotEmpty()
  @IsString()
  emqxRuleId: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
