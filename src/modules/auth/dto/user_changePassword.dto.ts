import { IsNotEmpty, MaxLength } from 'class-validator';

export class UserChangePasswordDto {
  @IsNotEmpty()
  @MaxLength(20)
  oldPassword: string;

  @IsNotEmpty()
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  @MaxLength(20)
  retypedNewPassword: string;
}
