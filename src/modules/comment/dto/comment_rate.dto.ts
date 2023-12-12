import { IsEnum, IsNotEmpty } from 'class-validator';

export class CommentRateDto {
  @IsNotEmpty()
  @IsEnum(['LIKE', 'DISLIKE', 'NONE'])
  action: string;
}
