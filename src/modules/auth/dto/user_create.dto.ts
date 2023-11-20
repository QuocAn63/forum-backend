import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UserRegistrationDto {
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @MaxLength(20)
  retypedPassword: string;
}
