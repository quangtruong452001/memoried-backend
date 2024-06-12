import { Post, Body, Get, Patch, Controller, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDTO } from 'src/database/dto/blog.dto';
import { SectionDTO } from 'src/database/dto/section.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  createBlog(
    @Body('blog') blog: BlogDTO,
    @Body('section') section: SectionDTO[],
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
  updateBlog(@Query('blog_id') blog_id: string, @Body() blog: BlogDTO) {
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
