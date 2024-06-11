import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comment.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private manager: EntityManager,
  ) {}

  async createComment(comment: Comment) {
    const newComment = new Comment(comment);
    return await this.manager.save(newComment);
  }

  async getCommentsByBlogId(blog_id: string) {
    return await this.commentRepository.find({
      where: {
        blog: blog_id,
      },
    });
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
