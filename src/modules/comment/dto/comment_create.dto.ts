import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentCreateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  parentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
