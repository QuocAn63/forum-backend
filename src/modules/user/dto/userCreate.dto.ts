import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @MinLength(6)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
