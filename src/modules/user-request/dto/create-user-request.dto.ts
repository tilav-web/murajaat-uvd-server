import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  user: string; // ID of User

  @IsString()
  @IsNotEmpty()
  checkedUrl: string; // ID of CheckedUrl

  // Temporary comment to force re-compilation
}
