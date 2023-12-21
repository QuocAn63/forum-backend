import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class RoleUpdatePermissionDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  roles: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ValidateIf((obj) => obj.role !== undefined)
  permissions: string[];
}
