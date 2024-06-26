import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserTopic } from 'src/database/entities/UserTopic.entity';
import { UserTopicDto } from 'src/database/dto/userTopic.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UserTopicService {
  constructor(
    @InjectRepository(UserTopic)
    private userTopicRepository: Repository<UserTopic>,
    private manager: EntityManager,
  ) {}

  async addUserIntoTopic(
    userTopicDto: UserTopicDto,
    current_user_id: string,
  ): Promise<UserTopic> {
    try {
      const userTopic = await this.userTopicRepository
        .createQueryBuilder('userTopic')
        .where(
          'userTopic.topic_id = :topicId AND userTopic.user_id = :userId',
          {
            userId: userTopicDto.user_id,
            topicId: userTopicDto.topic_id,
          },
        )
        .getOne();
      if (!userTopic) {
        const newUserTopic = new UserTopic(userTopicDto);
        newUserTopic.createdBy = current_user_id;
        newUserTopic.updatedBy = current_user_id;
        return await this.userTopicRepository.save(newUserTopic);
      }
      if (userTopic.isDeleted === false) {
        throw new Error('User already in this Topic');
      }
      userTopic.isDeleted = false;
      userTopic.updatedBy = current_user_id;
      userTopic.createdBy = current_user_id;
      return await this.userTopicRepository.save(userTopic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserTopics() {
    try {
      return await this.userTopicRepository.find({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUserTopic(userTopicDto: UserTopicDto) {
    try {
      const userTopic = await this.userTopicRepository
        .createQueryBuilder('userTopic')
        .where(
          'userTopic.user_id = :userId AND userTopic.topic_id = :topicId',
          {
            userId: userTopicDto.user_id,
            topicId: userTopicDto.topic_id,
          },
        )
        .getOne();
      if (!userTopic) {
        throw new Error('User not in this Topic');
      }
      userTopic.isDeleted = true;
      return await this.userTopicRepository.save(userTopic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTopicsOfUser(userId: string, type: string) {
    try {
      return await this.userTopicRepository
        .createQueryBuilder('userTopic')
        .where('userTopic.user_id = :userId', { userId }) // Filtering by user ID
        .leftJoinAndSelect('userTopic.topic', 'topic') // Correctly joining with the 'topic' relation
        .andWhere('topic.type = :type', { type }) // Filtering topics by type
        .getMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTopicsByUserId(userId: string) {
    try {
      return await this.userTopicRepository.find({
        where: { user_id: userId, isDeleted: false },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // create a query to get users by topic name
  async getUsersByTopic(topic_id: string) {
    try {
      const users = await this.userTopicRepository
        .createQueryBuilder('userTopic')
        .leftJoinAndSelect('userTopic.user', ' user')
        .where(
          'userTopic.topic_id = :topicId AND userTopic.isDeleted = :isDeleted',
          {
            topicId: topic_id,
            isDeleted: false,
          },
        )
        .getMany();

      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
