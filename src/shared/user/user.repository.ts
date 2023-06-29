import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './constants';
import { User } from './user.entity';

export type SearchCriteria = {
  id?: string;
  email?: string;
};

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>) {
    await this.userRepository.save(user);
  }

  async delete(searchCriteria: SearchCriteria) {
    await this.userRepository.delete({ ...searchCriteria });
  }

  async update(searchCriteria: SearchCriteria, user: Omit<Partial<User>, 'subordinates'>) {
    await this.userRepository.update({ ...searchCriteria }, user);
  }

  async findByCriteria(searchCriteria: SearchCriteria) {
    return this.userRepository.find({ where: { ...searchCriteria } });
  }

  async getSubordinates(searchCriteria: SearchCriteria) {
    return this.userRepository.find({ relations: [ 'subordinates' ], where: { ...searchCriteria } });
  }
}
