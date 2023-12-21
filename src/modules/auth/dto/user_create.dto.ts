import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UserRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  retypedPassword: string;
}
