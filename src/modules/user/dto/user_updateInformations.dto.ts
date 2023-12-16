import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserInformationsDto {
  @IsOptional()
  @IsString()
  @IsDate()
  dob?: string;

  @IsOptional()
  @IsEnum(['MALE', 'FEMALE'])
  gender?: string;
}
