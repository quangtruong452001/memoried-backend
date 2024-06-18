import { Controller, Patch } from '@nestjs/common';
import { UserTopicService } from './user-topic.service';
import { Post, Body, Get } from '@nestjs/common';
import { UserTopic } from 'src/database/entities/UserTopic.entity';
import { ValidationPipe } from '@nestjs/common';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('user-topic')
export class UserTopicController {
  constructor(private readonly userTopicService: UserTopicService) {}

  @Post()
  createNote(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopic,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.userTopicService.createUserTopic(userTopicDto, current_user_id);
  }

  @Patch('delete')
  deleteImage(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopic,
  ) {
    return this.userTopicService.deleteUserTopic(userTopicDto);
  }

  @Get()
  getUserTopicByUserId() {
    return this.userTopicService.getUserTopics();
  }
}
