import { Post, Body, Get, Patch, Controller, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from 'src/database/dto/blog.dto';
import { SectionDto } from 'src/database/dto/section.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  createBlog(
    @Body('blog') blog: BlogDto,
    @Body('section') section: SectionDto[],
  ) {
    return this.blogService.createBlog(blog, section);
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
  updateBlog(@Query('blog_id') blog_id: string, @Body() blog: BlogDto) {
    return this.blogService.updateBlog(blog_id, blog);
  }

  @Get()
  getBlogs() {
    return this.blogService.getBlogs();
  }

  @Patch('delete')
  deleteBlog(@Query('blog_id') blog_id: string) {
    return this.blogService.deleteBlog(blog_id);
  }
}
