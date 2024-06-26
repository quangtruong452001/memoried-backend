import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      if (blogDTO.type == 'company') {
        const blogtmp = {
          title: blogDTO.title,
          description: blogDTO.description,
          type: blogDTO.type,
          isDeleted: false,
          thumbnail: blogDTO.thumbnail,
          author: blogDTO.author,
          topic: null,
        };
        blogDTO = blogtmp;
      }

      const newBlog = new Blog(blogDTO);
      newBlog.createdBy = user_id;
      newBlog.updatedBy = user_id;
      return await this.manager.save(newBlog);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getBlogById(blog_id: string) {
    try {
      return await this.blogRepository.findOne({
        where: { id: blog_id, isDeleted: false },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async getBlogsByType(blog_type: string) {
  //   const blogs = await this.blogRepository
  //     .createQueryBuilder('blog')
  //     .where('blog.type = :type', {
  //       type: blog_type,
  //     })
  //     .getMany();
  //   return blogs;
  // }

  async getBlogs(
    type: BlogType,
    page: number = 1,
    limit: number = 5,
    user_id: string,
  ) {
    try {
      // If type is Company
      if (type === BlogType.COMPANY) {
        const blogs = await this.blogRepository.find({
          // relations: ['author', 'blog_section', 'blog_comment', 'topic'],
          // relations: ['topic'],
          where: {
            type: BlogType.COMPANY,
            isDeleted: false,
          },
          order: {
            createdAt: 'DESC',
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
          .leftJoinAndSelect('blog.topic', 'topic')
          .where('blog.type = :type AND blog.isDeleted = :isDeleted', {
            type: BlogType.TEAM,
            isDeleted: false,
          })
          .andWhere('blog.topic_id IN (:...topicIds)', {
            topicIds: topics.map((topic) => topic.topic_id),
          })
          .orderBy('blog.createdAt', 'DESC') // Order by createdAt
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
        // const blogs = await this.blogRepository
        //   .createQueryBuilder('blog')
        //   .where('blog.type = :type', {
        //     type: BlogType.PROJECT,
        //     isDeleted: false,
        //   })
        //   .andWhere('blog.topic_id IN (:...topicIds)', {
        //     topicIds: topics.map((topic) => topic.topic_id),
        //   })
        //   .orderBy('blog.createdAt', 'DESC') // Order by createdAt
        //   .skip((page - 1) * limit) // Skip the first `skip` records
        //   .take(limit) // Take up to `limit` records
        //   .getMany();
        const blogs = await this.blogRepository
          .createQueryBuilder('blog')
          .leftJoinAndSelect('blog.topic', 'topic')
          .where('blog.type = :type AND blog.isDeleted = :isDeleted', {
            type: BlogType.PROJECT,
            isDeleted: false,
          })
          .andWhere('blog.topic_id IN (:...topicIds)', {
            topicIds: topics.map((topic) => topic.topic_id),
          })
          .orderBy('blog.createdAt', 'DESC') // Order by createdAt
          .skip((page - 1) * limit) // Skip the first `skip` records
          .take(limit) // Take up to `limit` records
          .getMany();

        return blogs;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateBlog(blog_id: string, blog: BlogDto, current_user_id: string) {
    try {
      let blogToUpdate = await this.blogRepository.findOne({
        where: {
          id: blog_id,
        },
      });
      blogToUpdate = { ...blogToUpdate, ...blog };
      blogToUpdate.updatedBy = current_user_id;
      return await this.blogRepository.save(blogToUpdate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteBlog(blog_id: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
