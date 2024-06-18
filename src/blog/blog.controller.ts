import {
  Post,
  Body,
  Get,
  Patch,
  Controller,
  Query,
  ValidationPipe,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto, BlogType, CreateBlogDto } from 'src/database/dto/blog.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { convertImageToBase64, getInfoData } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  createBlog(
    @Body(new ValidationPipe({ transform: true })) blog: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() current_user_id: string,
  ) {
    if (!blog) {
      return 'Blog Information is required.';
    }
    let avatarBase64 = null;
    if (file) {
      avatarBase64 = convertImageToBase64(file);
    }
    const blogDto: BlogDto = {
      author: current_user_id,
      ...blog,
      thumbnail: avatarBase64,
    };
    return this.blogService.createBlog(blogDto, current_user_id);
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

    // return blogs.map((blog) => {
    //   return getInfoData({
    //     fields: [
    //       'id',
    //       'title',
    //       'description',
    //       'thumbnail',
    //       'type',
    //       'topic',
    //       'createdAt',
    //     ],
    //     object: blog,
    //   });
    // });
    return blogs;
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
