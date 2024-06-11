import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { EntityManager, Repository } from 'typeorm';
import { BlogDTO } from 'src/database/dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private sectionRepository: Repository<Blog>,
    private manager: EntityManager,
  ) {}

  async createBlog(blogDTO: BlogDTO) {
    const newBlog = new Blog(blogDTO);

    return await this.manager.save(newBlog);
  }

  async getBlogById(blog_id: string) {
    return await this.sectionRepository.findOne({ where: { id: blog_id } });
  }

  async getBlogsByType(blog_type: string) {
    const blogs = await this.sectionRepository
      .createQueryBuilder('blog')
      .where('blog.type = :type', {
        type: blog_type,
      })
      .getMany();
    return blogs;
  }

  async getBlogs() {
    return await this.sectionRepository.find();
  }

  async updateBlog(blog_id: string, blog: BlogDTO) {
    let blogToUpdate = await this.sectionRepository.findOne({
      where: {
        id: blog_id,
      },
    });
    blogToUpdate = { ...blogToUpdate, ...blog };
    return await this.manager.save(blogToUpdate);
  }
}
