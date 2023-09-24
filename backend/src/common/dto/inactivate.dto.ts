import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class InactivateDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
