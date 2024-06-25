import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentsGateway } from './comment.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService, CommentsGateway],
  controllers: [CommentController],
})
export class CommentModule {}
