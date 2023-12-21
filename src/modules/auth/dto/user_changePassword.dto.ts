import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UserChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  retypedNewPassword: string;
}
