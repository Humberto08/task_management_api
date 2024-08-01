import { IsInt, IsString, Max, Min } from "class-validator";

export class AuthResponseDTO {
  @IsString()
  token: string;

  @IsInt()
  @Min(0)
  @Max(31536000)
  expiresIn: number;
}
