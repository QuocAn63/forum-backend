import { IsNotEmpty, MaxLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}
