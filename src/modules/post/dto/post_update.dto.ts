import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostUpdateDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    enum: ['PUBLIC', 'DRAFT', 'PRIVATE'],
  })
  @IsOptional()
  @IsEnum(['PUBLIC', 'DRAFT', 'PRIVATE'])
  status: string;
}
