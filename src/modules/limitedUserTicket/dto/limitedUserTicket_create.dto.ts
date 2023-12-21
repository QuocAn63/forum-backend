import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateLimitedUserTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  permissions: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/\d+[hdwM]$/)
  expiredIn: string;
}
