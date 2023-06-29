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
    return this.userRepository.save(this.userRepository.create(user));
  }

  async update(searchCriteria: SearchCriteria, user: Omit<Partial<User>, 'subordinates'>) {
    return this.userRepository.update({ ...searchCriteria }, this.userRepository.create(user));
  }

  async delete(searchCriteria: SearchCriteria) {
    return this.userRepository.delete({ ...searchCriteria });
  }

  async exist(searchCriteria: SearchCriteria) {
    return this.userRepository.exist({ where: { ...searchCriteria } });
  }

  async findByCriteria(searchCriteria: SearchCriteria) {
    return this.userRepository.findOne({ where: { ...searchCriteria } });
  }

  async getSubordinates(searchCriteria: SearchCriteria) {
    return this.userRepository.find({ relations: [ 'subordinates' ], where: { ...searchCriteria } });
  }
}
