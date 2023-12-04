import { IsEnum, IsNotEmpty } from 'class-validator';

export class PostRateDto {
  @IsNotEmpty()
  @IsEnum(['LIKE', 'DISLIKE', 'NONE'])
  action: string;
}
