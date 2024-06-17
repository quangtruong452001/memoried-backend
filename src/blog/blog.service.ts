import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { EntityManager, Repository } from 'typeorm';
import { BlogDto, BlogType } from 'src/database/dto/blog.dto';
import { UserTopicService } from 'src/user-topic/user-topic.service';
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private manager: EntityManager,
    private userTopicService: UserTopicService,
  ) {}

  async createBlog(blogDTO: BlogDto, user_id: string) {
    const newBlog = new Blog(blogDTO);
    newBlog.createdBy = user_id;
    newBlog.updatedBy = user_id;
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

  async getBlogs(
    type: BlogType,
    page: number = 1,
    limit: number = 10,
    user_id: string,
  ) {
    // If type is Company
    if (type === BlogType.COMPANY) {
      const blogs = await this.blogRepository.find({
        // relations: ['author', 'blog_section', 'blog_comment', 'topic'],
        relations: ['author'],
        where: {
          type: BlogType.COMPANY,
          isDeleted: false,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      return blogs;
    } else if (type === BlogType.TEAM) {
      // If type is Team
      // Only return blogs that belong to the current user team

      // Get all topic current user belong
      const topics = await this.userTopicService.getTopicsOfUser(
        user_id,
        BlogType.TEAM,
      );

      // Check if topics array is empty
      if (topics.length === 0) {
        return []; // Return an empty array or handle as needed
      }

      // Get all blog that belong to the topics
      const blogs = await this.blogRepository
        .createQueryBuilder('blog')
        .where('blog.type = :type', {
          type: BlogType.TEAM,
        })
        .andWhere('blog.topic_id IN (:...topicIds)', {
          topicIds: topics.map((topic) => topic.topic_id),
        })
        .skip((page - 1) * limit) // Skip the first `skip` records
        .take(limit) // Take up to `limit` records
        .getMany();

      return blogs;
    } else {
      // If type is Project
      // Only return blogs that belong to the current user project

      // Get all topic current user belong
      const topics = await this.userTopicService.getTopicsOfUser(
        user_id,
        BlogType.PROJECT,
      );

      // Check if topics array is empty
      if (topics.length === 0) {
        return []; // Return an empty array or handle as needed
      }

      // Get all blog that belong to the topics
      const blogs = await this.blogRepository
        .createQueryBuilder('blog')
        .where('blog.type = :type', {
          type: BlogType.PROJECT,
        })
        .andWhere('blog.topic_id IN (:...topicIds)', {
          topicIds: topics.map((topic) => topic.topic_id),
        })
        .skip((page - 1) * limit) // Skip the first `skip` records
        .take(limit) // Take up to `limit` records
        .getMany();

      return blogs;
    }
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
