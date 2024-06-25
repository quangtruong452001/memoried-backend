import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/database/dto/comment.dto';
import { Comment } from 'src/database/entities/comment.entity';
import { Repository, EntityManager } from 'typeorm';
import { CommentsGateway } from './comment.gateway';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private manager: EntityManager,
    private readonly commentsGateway: CommentsGateway,
  ) {}

  async createComment(comment: CommentDto, current_user_id: string) {
    try {
      const newComment = new Comment(comment);
      newComment.createdBy = current_user_id;
      newComment.updatedBy = current_user_id;
      newComment.user.id = current_user_id;
      const savedComment = await this.commentRepository.save(newComment);

      // Phát sự kiện WebSocket khi có bình luận mới
      this.commentsGateway.handleNewComment(savedComment);

      return savedComment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCommentsByBlogId(blog_id: string) {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.blog', 'blog')
        .leftJoinAndSelect('comment.user', 'user')
        .where('blog.id = :blogId AND comment.isDeleted = :isDeleted', {
          blogId: blog_id,
          isDeleted: false,
        })
        .orderBy('comment.createdAt', 'ASC')
        .getMany();

      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateComment(
    comment_id: string,
    comment: CommentDto,
    current_user_id: string,
  ) {
    try {
      let commentToUpdate = await this.commentRepository.findOne({
        where: {
          id: comment_id,
        },
      });
      if (!commentToUpdate) {
        throw new BadRequestException('Comment not found');
      }
      commentToUpdate = { ...commentToUpdate, ...comment };
      commentToUpdate.updatedBy = current_user_id;
      return await this.commentRepository.save(commentToUpdate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteComment(comment_id: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: {
          id: comment_id,
        },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      comment.isDeleted = true;
      return await this.manager.save(comment);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
