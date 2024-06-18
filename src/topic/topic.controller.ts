import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDto } from 'src/database/dto/topic.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  createTopic(
    @Body(new ValidationPipe({ transform: true })) topicDto: TopicDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.topicService.createTopic(topicDto, current_user_id);
  }

  @Get()
  getTopics() {
    return this.topicService.getTopics();
  }

  @Get('getbyuser')
  getTopicByUserId(@GetCurrentUserId() user_id: string) {
    return this.topicService.getTopicByUserId(user_id);
  }

  @Patch('update')
  updateTopic(
    @Body(new ValidationPipe({ transform: true })) topicDto: TopicDto,
    @GetCurrentUserId() current_user_id: string,
    topic_id: string,
  ) {
    return this.topicService.updateTopic(topic_id, topicDto, current_user_id);
  }

  @Patch('delete')
  deleteTopic(topic_id: string) {
    return this.topicService.deleteTopic(topic_id);
  }
}
