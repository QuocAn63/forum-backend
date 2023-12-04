import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostUpdateDto {
  @IsOptional()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'DRAFT', 'PRIVATE'])
  status: string;
}
