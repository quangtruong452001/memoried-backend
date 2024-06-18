import {
  Post,
  Body,
  Get,
  Patch,
  Controller,
  Query,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto, BlogType } from 'src/database/dto/blog.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { getInfoData } from 'src/utils';

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
  async getBlogs(
    @GetCurrentUserId() user_id: string,
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    // Return error if not have type, page or limit
    if (!type) {
      return new BadRequestException('Missing required query parameters');
    }
    const blogType = type as BlogType;
    const blogs = await this.blogService.getBlogs(
      blogType,
      page,
      limit,
      user_id,
    );

    return blogs.map((blog) => {
      return getInfoData({
        fields: [
          'id',
          'title',
          'description',
          'thumbnail',
          'type',
          'createdAt',
        ],
        object: blog,
      });
    });
  }

  @Get('getbytype')
  getBlogsByType(@Query('blog_type') blog_type: string) {
    return this.blogService.getBlogsByType(blog_type);
  }

  @Get('getbyBlogId')
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
