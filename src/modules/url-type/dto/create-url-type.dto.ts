import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUrlTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
