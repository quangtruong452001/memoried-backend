import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { CreateUserDto, UserOptionalDto } from 'src/database/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private manager: EntityManager,
  ) {}
  async createUser(userInput: CreateUserDto) {
    try {
      const newUser = new User(userInput);
      const user = await this.manager.save(newUser);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByUsername(username: string) {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserById(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(user_id: string, userInfo: UserOptionalDto) {
    try {
      let userToUpdate = await this.userRepository.findOne({
        where: {
          id: user_id,
        },
      });
      userToUpdate = { ...userToUpdate, ...userInfo };
      const updatedUser = await this.manager.save(User, userToUpdate);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchUser(query: string) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(user.username) LIKE LOWER(:searchTerm)', {
          searchTerm: `%${query}%`,
        })
        .getMany();
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
