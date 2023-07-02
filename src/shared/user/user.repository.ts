import { DeepPartial, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { RoleEnum } from '@shared/role';
import { User } from './user.entity';
import { USER_REPOSITORY } from './constants';

export type UserCriteria = {
  field: 'id' | 'email';
  value: string;
};

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User) {
    return this.userRepository.save(this.createInstance(user));
  }

  async setBoss(criteria: UserCriteria, boss: string) {
    await this.userRepository.update({ [criteria.field]: criteria.value }, { boss });
  }

  async updateRole(criteria: UserCriteria, role: RoleEnum) {
    await this.userRepository.update({ [criteria.field]: criteria.value }, { role });
  }

  async updateRefreshToken(criteria: UserCriteria, refreshToken: string | null) {
    const user = this.createInstance({ refreshToken });
    await this.userRepository.update({ [criteria.field]: criteria.value }, user);
  }

  async getUserWithSubordinates(criteria: UserCriteria) {
    return this.userRepository
      .findOne({ where: { [criteria.field]: criteria.value }, relations: [ 'subordinates' ] });
  }

  async exist(criteria: UserCriteria) {
    return this.userRepository.exist({ where: { [criteria.field]: criteria.value } });
  }

  async get(criteria: UserCriteria) {
    return this.userRepository.findOne({ where: { [criteria.field]: criteria.value } });
  }

  async getAll() {
    return this.userRepository.find();
  }

  createInstance(user: DeepPartial<User>) {
    return this.userRepository.create(user);
  }
}
