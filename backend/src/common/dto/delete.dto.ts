import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  templateId?: string;

  @IsOptional()
  @IsString()
  dId?: string;
}
