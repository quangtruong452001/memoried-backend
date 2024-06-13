import { Section } from './../database/entities/section.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { EntityManager, Repository } from 'typeorm';
import { BlogDto } from 'src/database/dto/blog.dto';
import { SectionDto } from 'src/database/dto/section.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private sectionRepository: Repository<Blog>,
    private manager: EntityManager,
  ) {}

  async createBlog(blogDTO: BlogDto, sectionData: SectionDto[]) {
    const newBlog = new Blog(blogDTO);
    newBlog.blog_section = sectionData.map((data) => {
      return new Section(data);
    });
    return await this.manager.save(newBlog);
  }

  async getBlogById(blog_id: string) {
    return await this.sectionRepository.findOne({
      where: { id: blog_id, isDeleted: false },
    });
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
    return await this.sectionRepository.find({ where: { isDeleted: false } });
  }

  async updateBlog(blog_id: string, blog: BlogDto) {
    let blogToUpdate = await this.sectionRepository.findOne({
      where: {
        id: blog_id,
      },
    });
    blogToUpdate = { ...blogToUpdate, ...blog };
    return await this.manager.save(blogToUpdate);
  }

  async deleteBlog(blog_id: string) {
    const blog = await this.sectionRepository.findOne({
      where: {
        id: blog_id,
      },
    });
    if (!blog) {
      throw new Error('Blog not found');
    }
    blog.isDeleted = true;
    return await this.manager.save(blog);
  }
}
