import { Controller, Patch } from '@nestjs/common';
import { UserTopicService } from './user-topic.service';
import { Post, Body, Get } from '@nestjs/common';
import { UserTopic } from 'src/database/entities/UserTopic.entity';
import { ValidationPipe } from '@nestjs/common';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { SuccessResponse } from 'src/core/success.response';

@Controller('user-topic')
export class UserTopicController {
  constructor(private readonly userTopicService: UserTopicService) {}

  @Post()
  async createNote(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopic,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new SuccessResponse({
      message: 'Create user topic successfully',
      metadata: await this.userTopicService.createUserTopic(
        userTopicDto,
        current_user_id,
      ),
    });
  }

  @Patch('delete')
  async deleteImage(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopic,
  ) {
    return new SuccessResponse({
      message: 'Delete user topic successfully',
      metadata: await this.userTopicService.deleteUserTopic(userTopicDto),
    });
  }

  @Get()
  async getUserTopicIdByUserId(@GetCurrentUserId() current_user_id: string) {
    return new SuccessResponse({
      message: 'Get user topic successfully',
      metadata: await this.userTopicService.getTopicsByUserId(current_user_id),
    });
  }

  @Get('getbytype')
  async getUserTopicsByType(
    @GetCurrentUserId() current_user_id: string,
    @Body() type: string,
  ) {
    return new SuccessResponse({
      message: 'Get user topic by type successfully',
      metadata: await this.userTopicService.getTopicsOfUser(
        current_user_id,
        type,
      ),
    });
  }
}
