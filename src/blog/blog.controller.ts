import { Post, Body, Get, Patch, Controller, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDTO } from 'src/database/dto/blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  createBlog(@Body() blog: BlogDTO) {
    return this.blogService.createBlog(blog);
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
  updateBlog(@Query('blog_id') blog_id: string, @Body() blog: BlogDTO) {
    return this.blogService.updateBlog(blog_id, blog);
  }

  @Get()
  getBlogs() {
    return this.blogService.getBlogs();
  }
}
