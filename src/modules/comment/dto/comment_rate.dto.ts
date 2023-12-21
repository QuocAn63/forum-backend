import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CommentRateDto {
  @ApiProperty({
    enum: ['LIKE', 'DISLIKE', 'NONE'],
  })
  @IsNotEmpty()
  @IsEnum(['LIKE', 'DISLIKE', 'NONE'])
  action: string;
}
