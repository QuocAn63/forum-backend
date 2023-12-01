import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  status: string;
}
