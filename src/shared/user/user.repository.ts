import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User) {
    await this.userRepository.save(user);
  }

  async getAll() {
    return this.userRepository.find();
  }
}
