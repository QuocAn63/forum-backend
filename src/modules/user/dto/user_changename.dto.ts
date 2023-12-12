import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeDisplayNameDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  name: string;
}
