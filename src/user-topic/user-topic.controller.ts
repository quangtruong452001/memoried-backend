import { BadRequestException, Controller, Patch, Query } from '@nestjs/common';
import { UserTopicService } from './user-topic.service';
import { Post, Body, Get } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { SuccessResponse } from 'src/core/success.response';
import { UserTopicDto } from 'src/database/dto';

@Controller('user-topic')
export class UserTopicController {
  constructor(private readonly userTopicService: UserTopicService) {}

  @Post('adduser')
  async AddUserIntoTopic(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopicDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    try {
      return new SuccessResponse({
        message: 'Create user topic successfully',
        metadata: await this.userTopicService.addUserIntoTopic(
          userTopicDto,
          current_user_id,
        ),
      });
    } catch (error) {
      if (error.message) {
        return new SuccessResponse({
          message: 'User already added',
        });
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch('delete')
  async deleteUserFromTopic(
    @Body(new ValidationPipe({ transform: true })) userTopicDto: UserTopicDto,
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

  @Get('getusers')
  async getUsersByTopicName(@Query('topic_id') topic_id: string) {
    return new SuccessResponse({
      message: 'Get users by topic name successfully',
      metadata: await this.userTopicService.getUsersByTopic(topic_id),
    });
  }
}
