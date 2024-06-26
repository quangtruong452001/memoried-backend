import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDto } from 'src/database/dto/topic.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { SuccessResponse } from 'src/core/success.response';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post('create')
  async createTopic(
    @Body(new ValidationPipe({ transform: true })) topicDto: TopicDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new SuccessResponse({
      message: 'Create topic successfully',
      metadata: await this.topicService.createTopic(topicDto, current_user_id),
    });
  }

  @Get()
  async getTopics() {
    return new SuccessResponse({
      message: 'Get topics successfully',
      metadata: await this.topicService.getTopics(),
    });
  }

  @Get('getbytype')
  async getTopicByType(@Query('type') type: string) {
    return new SuccessResponse({
      message: 'Get topics by type successfully',
      metadata: await this.topicService.getTopicByType(type),
    });
  }

  @Get('getbyuser')
  async getTopicByUserId(@GetCurrentUserId() user_id: string) {
    return new SuccessResponse({
      message: 'Get topics by user successfully',
      metadata: await this.topicService.getTopicByUserId(user_id),
    });
  }

  @Patch('update')
  async updateTopic(
    @Body(new ValidationPipe({ transform: true })) topicDto: TopicDto,
    @GetCurrentUserId() current_user_id: string,
    topic_id: string,
  ) {
    return new SuccessResponse({
      message: 'Update topic successfully',
      metadata: await this.topicService.updateTopic(
        topic_id,
        topicDto,
        current_user_id,
      ),
    });
  }

  @Patch('delete')
  async deleteTopic(topic_id: string) {
    return new SuccessResponse({
      message: 'Delete topic successfully',
      metadata: await this.topicService.deleteTopic(topic_id),
    });
  }
}
