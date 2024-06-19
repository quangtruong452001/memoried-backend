import { Controller, Get, Patch, Query, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/database/entities/comment.entity';
import { Post, Body } from '@nestjs/common';
import { CommentDto } from 'src/database/dto/comment.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('create')
  createComment(
    @Body(new ValidationPipe({ transform: true })) comment: CommentDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.commentService.createComment(comment, current_user_id);
  }

  @Get('getbyblog')
  getCommentsByBlogId(@Query('blog_id') blog_id: string) {
    return this.commentService.getCommentsByBlogId(blog_id);
  }

  @Patch('update')
  updateComment(
    @Query() comment_id: string,
    @Body(new ValidationPipe({ transform: true })) commentDto: CommentDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.commentService.updateComment(
      comment_id,
      commentDto,
      current_user_id,
    );
  }

  @Patch('delete')
  deleteComment(@Query() comment_id: string) {
    return this.commentService.deleteComment(comment_id);
  }
}
