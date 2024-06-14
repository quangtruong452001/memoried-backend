import { Module } from '@nestjs/common';
import { UserTopicController } from './user-topic.controller';
import { UserTopicService } from './user-topic.service';
import { UserTopic } from 'src/database/entities/UserTopic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserTopic])],
  controllers: [UserTopicController],
  providers: [UserTopicService],
})
export class UserTopicModule {}
