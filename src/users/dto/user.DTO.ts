import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UserDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
