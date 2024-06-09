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

  async createUser(user: CreateUserDto) {
    const newUser = new User(user);

    return await this.manager.save(newUser);
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async updateUser(user_id: string, user: UserOptionalDto) {
    let userToUpdate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    userToUpdate = { ...userToUpdate, ...user };

    return await this.manager.save(userToUpdate);
  }
}
