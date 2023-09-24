import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChartDataDto {
  @IsNotEmpty()
  @IsString()
  dId: string;

  @IsNotEmpty()
  @IsString()
  variable: string;

  @IsOptional()
  @IsNumber()
  chartTimeAgo?: number;
}
