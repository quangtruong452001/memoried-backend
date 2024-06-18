import { UserTopicService } from 'src/user-topic/user-topic.service';
import { Repository, EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
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
    const newTopic = new Topic(topicDto);
    newTopic.createdBy = current_user_id;
    newTopic.updatedBy = current_user_id;
    return await this.manager.save(newTopic);
  }

  async getTopics() {
    return await this.topicRepository.find({ where: { isDeleted: false } });
  }

  async getTopicByUserId(user_id: string) {
    const topics = await this.userTopicService.getTopicsByUserId(user_id);
    return await this.topicRepository.find({
      where: { id: In(topics), isDeleted: false },
    });
  }

  async updateTopic(
    topic_id: string,
    topic: TopicDto,
    current_user_id: string,
  ) {
    let topicToUpdate = await this.topicRepository.findOne({
      where: {
        id: topic_id,
      },
    });
    topicToUpdate = { ...topicToUpdate, ...topic };
    topicToUpdate.updatedBy = current_user_id;
    return await this.topicRepository.save(topicToUpdate);
  }

  async deleteTopic(topic_id: string) {
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
  }
}
