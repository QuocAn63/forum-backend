import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateLimitedUserTicketDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  permissions: string[];

  @IsNotEmpty()
  @IsString()
  @Matches(/\d+[hdwM]$/)
  expiredIn: string;
}
