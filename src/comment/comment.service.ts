import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/database/dto/comment.dto';
import { Comment } from 'src/database/entities/comment.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private manager: EntityManager,
  ) {}

  async createComment(comment: CommentDto, current_user_id: string) {
    const newComment = new Comment(comment);
    newComment.createdBy = current_user_id;
    newComment.updatedBy = current_user_id;
    return await this.commentRepository.save(newComment);
  }

  async getCommentsByBlogId(blog_id: string) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId: blog_id,
        isDeleted: false,
      })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    return comments;
  }

  async updateComment(
    comment_id: string,
    comment: CommentDto,
    current_user_id: string,
  ) {
    let commentToUpdate = await this.commentRepository.findOne({
      where: {
        id: comment_id,
      },
    });
    commentToUpdate = { ...commentToUpdate, ...comment };
    commentToUpdate.updatedBy = current_user_id;
    return await this.commentRepository.save(commentToUpdate);
  }

  async deleteComment(comment_id: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: comment_id,
      },
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    comment.isDeleted = true;
    return await this.manager.save(comment);
  }
}
