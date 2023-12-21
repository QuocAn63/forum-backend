import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sendTo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum([
    'PostLike',
    'PostDislike',
    'PostComment',
    'CommentLike',
    'CommentDislike',
    'CommentReply',
  ])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['POST', 'USER', 'COMMENT'])
  objectType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  prepObjectId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(['POST', 'USER', 'COMMENT'])
  prepObjectType?: string;
}
