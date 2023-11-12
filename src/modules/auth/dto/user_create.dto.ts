import { IsString, MaxLength, ValidateIf, Equals } from 'class-validator';

export class UserSignupDto {
  @IsString()
  @MaxLength(20)
  username: string;

  @IsString()
  @MaxLength(20)
  password: string;

  @IsString()
  @MaxLength(20)
  retypedPassword: string;
}
