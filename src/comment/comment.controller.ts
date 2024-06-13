import { Controller, Get, Patch, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/database/entities/comment.entity';
import { Post, Body } from '@nestjs/common';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('create')
  createComment(@Body() comment: Comment) {
    return this.commentService.createComment(comment);
  }

  @Get('getbyblog')
  getCommentsByBlogId(@Query() blog_id: string) {
    return this.commentService.getCommentsByBlogId(blog_id);
  }

  @Patch('delete')
  deleteComment(@Query() comment_id: string) {
    return this.commentService.deleteComment(comment_id);
  }
}
