import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { EntityManager, Repository } from 'typeorm';
import { BlogDto } from 'src/database/dto/blog.dto';
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private manager: EntityManager,
  ) {}

  async createBlog(blogDTO: BlogDto, current_user_id: string) {
    const newBlog = new Blog(blogDTO);
    newBlog.createdBy = current_user_id;
    newBlog.updatedBy = current_user_id;
    return await this.manager.save(newBlog);
  }

  async getBlogById(blog_id: string) {
    return await this.blogRepository.findOne({
      where: { id: blog_id, isDeleted: false },
    });
  }

  async getBlogsByType(blog_type: string) {
    const blogs = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.type = :type', {
        type: blog_type,
      })
      .getMany();
    return blogs;
  }

  async getBlogs() {
    return await this.blogRepository.find({ where: { isDeleted: false } });
  }

  async updateBlog(blog_id: string, blog: BlogDto, current_user_id: string) {
    let blogToUpdate = await this.blogRepository.findOne({
      where: {
        id: blog_id,
      },
    });
    blogToUpdate = { ...blogToUpdate, ...blog };
    blogToUpdate.updatedBy = current_user_id;
    return await this.blogRepository.save(blogToUpdate);
  }

  async deleteBlog(blog_id: string) {
    const blog = await this.blogRepository.findOne({
      where: {
        id: blog_id,
      },
    });
    if (!blog) {
      throw new Error('Blog not found');
    }
    blog.isDeleted = true;
    return await this.blogRepository.save(blog);
  }
}
