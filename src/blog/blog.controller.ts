import {
  Post,
  Body,
  Get,
  Patch,
  Controller,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from 'src/database/dto/blog.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  createBlog(
    @Body(new ValidationPipe({ transform: true })) blog: BlogDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.blogService.createBlog(blog, current_user_id);
  }

  @Get()
  getBlogs() {
    return this.blogService.getBlogs();
  }

  @Get('getbytype')
  getBlogsByType(@Query('blog_type') blog_type: string) {
    return this.blogService.getBlogsByType(blog_type);
  }

  @Get('getbyblog')
  getBlogById(@Query('blog_id') blog_id: string) {
    return this.blogService.getBlogById(blog_id);
  }

  @Patch('update')
  updateBlog(
    @Query('blog_id') blog_id: string,
    @Body(new ValidationPipe({ transform: true })) blog: BlogDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.blogService.updateBlog(blog_id, blog, current_user_id);
  }

  @Patch('delete')
  deleteBlog(@Query('blog_id') blog_id: string) {
    return this.blogService.deleteBlog(blog_id);
  }
}
