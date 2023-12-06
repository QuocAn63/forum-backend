import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class RoleUpdatePermissionDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  roles: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ValidateIf((obj) => obj.role !== undefined)
  permissions: string[];
}
