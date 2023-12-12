import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, AuthUser } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import { CommentService } from './comment.service';
import { CommentRateDto } from './dto/comment_rate.dto';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post(':id/rate')
  async rateComment(
    @User() user: AuthUser,
    @Param('id') id: string,
    @Body() data: CommentRateDto,
  ) {
    return await this.commentService.rateComment(user, id, data.action);
  }

  @Delete(':id')
  async softDeleteComment(@User() user: AuthUser, @Param('id') id: string) {
    return await this.commentService.deleteComment(user, id);
  }
}
