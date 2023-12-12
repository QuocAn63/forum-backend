import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsOptional()
  @IsString()
  parentId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
