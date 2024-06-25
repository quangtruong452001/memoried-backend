import { UserTopicService } from 'src/user-topic/user-topic.service';
import { Repository, EntityManager, In } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Topic } from 'src/database/entities/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicDto } from 'src/database/dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(
    private userTopicService: UserTopicService,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    private manager: EntityManager,
  ) {}

  async createTopic(topicDto: TopicDto, current_user_id: string) {
    try {
      const newTopic = new Topic(topicDto);
      newTopic.createdBy = current_user_id;
      newTopic.updatedBy = current_user_id;
      return await this.manager.save(newTopic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTopics() {
    try {
      return await this.topicRepository.find({ where: { isDeleted: false } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTopicByUserId(user_id: string) {
    try {
      const topics = await this.userTopicService.getTopicsByUserId(user_id);
      const topicIds = topics.map((topic) => topic.topic_id);
      return await this.topicRepository.find({
        where: { id: In(topicIds), isDeleted: false },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateTopic(
    topic_id: string,
    topic: TopicDto,
    current_user_id: string,
  ) {
    try {
      let topicToUpdate = await this.topicRepository.findOne({
        where: {
          id: topic_id,
        },
      });
      topicToUpdate = { ...topicToUpdate, ...topic };
      topicToUpdate.updatedBy = current_user_id;
      return await this.topicRepository.save(topicToUpdate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteTopic(topic_id: string) {
    try {
      const topic = await this.topicRepository.findOne({
        where: {
          id: topic_id,
        },
      });
      if (!topic) {
        throw new Error('Topic not found');
      }
      topic.isDeleted = true;
      return await this.manager.save(topic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
