import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class PermissionCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
