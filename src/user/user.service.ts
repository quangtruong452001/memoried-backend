import { Injectable } from '@nestjs/common';
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
    const newUser = new User(userInput);

    const user = await this.manager.save(newUser);
    return user;
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(user_id: string, userInfo: UserOptionalDto) {
    let userToUpdate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });
    userToUpdate = { ...userToUpdate, ...userInfo };
    const updatedUser = await this.manager.save(User, userToUpdate);
    return updatedUser;
  }
}
