import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class PostRateDto {
  @ApiProperty({
    enum: ['LIKE', 'DISLIKE', 'NONE'],
  })
  @IsNotEmpty()
  @IsEnum(['LIKE', 'DISLIKE', 'NONE'])
  action: string;
}
