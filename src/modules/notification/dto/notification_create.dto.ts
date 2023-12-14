import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  sendTo: string;

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

  @IsNotEmpty()
  @IsString()
  objectId: string;

  @IsNotEmpty()
  @IsEnum(['POST', 'USER', 'COMMENT'])
  objectType: string;

  @IsOptional()
  @IsString()
  prepObjectId?: string;

  @IsOptional()
  @IsEnum(['POST', 'USER', 'COMMENT'])
  prepObjectType?: string;
}
