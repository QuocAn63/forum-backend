import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsOptional()
  @IsString()
  parentCommentId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
