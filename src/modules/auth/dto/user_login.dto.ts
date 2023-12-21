import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
