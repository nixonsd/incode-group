import { Repository } from 'typeorm';
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

  async create(user: Partial<User>) {
    return this.userRepository.save(this.userRepository.create(user));
  }

  async updateRole(criteria: UserCriteria, role: RoleEnum) {
    await this.userRepository.update({ [criteria.field]: criteria.value }, { role });
  }

  async updateRefreshToken(criteria: UserCriteria, refreshToken: string | null) {
    const user = this.userRepository.create({ refreshToken });
    await this.userRepository.update({ [criteria.field]: criteria.value }, user);
  }

  async getRole(criteria: UserCriteria): Promise<RoleEnum|null> {
    return this.userRepository
      .findOne({ select: { role: true }, where: { [criteria.field]: criteria.value } })
      .then(user => user ? user.role : null);
  }

  async getBossOfUser(criteria: UserCriteria): Promise<string|null> {
    return this.userRepository
      .findOne({ select: { role: true }, where: { [criteria.field]: criteria.value }, relations: [ 'boss' ] })
      .then(user => user ? user.boss : null);
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
}
