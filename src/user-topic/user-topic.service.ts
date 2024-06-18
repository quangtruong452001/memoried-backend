import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserTopic } from 'src/database/entities/UserTopic.entity';
import { UserTopicDto } from 'src/database/dto/userTopic.dto';

@Injectable()
export class UserTopicService {
  constructor(
    @InjectRepository(UserTopic)
    private userTopicRepository: Repository<UserTopic>,
    private manager: EntityManager,
  ) {}

  async createUserTopic(
    userTopicDto: UserTopicDto,
    current_user_id: string,
  ): Promise<UserTopic> {
    const userTopic = await this.userTopicRepository
      .createQueryBuilder('userTopic')
      .leftJoinAndSelect('userTopic.user', 'user')
      .where('topic.id = :topicId , user.id = :userId', {
        userId: userTopicDto.user_id,
        sectionId: userTopicDto.topic_id,
      })
      .getOne();
    if (!userTopic) {
      const newUserTopic = new UserTopic(userTopicDto);
      newUserTopic.createdBy = current_user_id;
      newUserTopic.updatedBy = current_user_id;
      return await this.userTopicRepository.save(newUserTopic);
    }
    userTopic.isDeleted = false;
    userTopic.updatedBy = current_user_id;
    userTopic.createdBy = current_user_id;
    return await this.userTopicRepository.save(userTopic);
  }

  async getUserTopics() {
    return await this.userTopicRepository.find({ where: { isDeleted: false } });
  }

  async deleteUserTopic(userTopicDto: UserTopicDto) {
    const userTopic = await this.userTopicRepository
      .createQueryBuilder('userTopic')
      .leftJoinAndSelect('userTopic.user', 'user')
      .where('topic.id = :topicId , user.id = :userId', {
        userId: userTopicDto.user_id,
        sectionId: userTopicDto.topic_id,
      })
      .getOne();
    if (!userTopic) {
      throw new Error('Image not found');
    }
    userTopic.isDeleted = true;
    return await this.userTopicRepository.save(userTopic);
  }

  async getTopicsOfUser(userId: string, type: string) {
    return await this.userTopicRepository
      .createQueryBuilder('userTopic')
      .where('userTopic.user_id = :userId', { userId }) // Filtering by user ID
      .leftJoinAndSelect('userTopic.topic', 'topic') // Correctly joining with the 'topic' relation
      .andWhere('topic.type = :type', { type }) // Filtering topics by type
      .getMany();
  }
}
