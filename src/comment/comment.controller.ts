import { Controller, Get, Patch, Query, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Post, Body } from '@nestjs/common';
import { CommentDto } from 'src/database/dto/comment.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { Created, SuccessResponse } from 'src/core/success.response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('create')
  async createComment(
    @Body(new ValidationPipe({ transform: true })) comment: CommentDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new Created({
      message: 'Comment created successfully',
      metadata: await this.commentService.createComment(
        comment,
        current_user_id,
      ),
    });
  }

  @Get('getbyblog')
  async getCommentsByBlogId(@Query('blog_id') blog_id: string) {
    return new SuccessResponse({
      message: 'Comments fetched successfully',
      metadata: await this.commentService.getCommentsByBlogId(blog_id),
    });
  }

  @Patch('update')
  async updateComment(
    @Query() comment_id: string,
    @Body(new ValidationPipe({ transform: true })) commentDto: CommentDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new SuccessResponse({
      message: 'Comment updated successfully',
      metadata: await this.commentService.updateComment(
        comment_id,
        commentDto,
        current_user_id,
      ),
    });
  }

  @Patch('delete')
  deleteComment(@Query() comment_id: string) {
    return new SuccessResponse({
      message: 'Comment deleted successfully',
      metadata: this.commentService.deleteComment(comment_id),
    });
  }
}
