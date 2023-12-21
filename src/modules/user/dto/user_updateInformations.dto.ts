import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserInformationsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsDate()
  dob?: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE'] })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE'])
  gender?: string;
}
