import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { Topic } from 'src/database/entities/topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTopicModule } from 'src/user-topic/user-topic.module';
import { UserTopicService } from 'src/user-topic/user-topic.service';
import { UserTopic } from 'src/database/entities/UserTopic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, UserTopic]), UserTopicModule],
  controllers: [TopicController],
  providers: [TopicService, UserTopicService],
})
export class TopicModule {}
