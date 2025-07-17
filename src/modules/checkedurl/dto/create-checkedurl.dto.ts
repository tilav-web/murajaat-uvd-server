import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CheckedUrlStatus } from '../schemas/checkedurl.schema';
import { Types } from 'mongoose';

export class CreateCheckedUrlDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(CheckedUrlStatus)
  @IsOptional()
  status?: CheckedUrlStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
