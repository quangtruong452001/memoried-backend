import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UserTopicService } from 'src/user-topic/user-topic.service';
import { UserTopic } from 'src/database/entities/UserTopic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, UserTopic])],
  providers: [BlogService, UserTopicService],
  controllers: [BlogController],
})
export class BlogModule {}
