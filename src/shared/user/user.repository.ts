import { DeepPartial, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async transferSubordinate(criteria: UserCriteria, from: string, to: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subordinates', 'subordinates')
      .loadRelationCountAndMap('user.subordinatesCount', 'user.subordinates')
      .where('user.email IN (:...emails)', { emails: [ from, to ] })
      .getMany();

    const fromUser = users.find(user => user.email === from) as User & {subordinatesCount: number} | undefined;
    const toUser = users.find(user => user.email === to) as User & {subordinatesCount: number} | undefined;
    if (!fromUser || !toUser)
      throw new NotFoundException('User is not found');

    if (fromUser.role !== RoleEnum.ADMINISTRATOR && fromUser.subordinatesCount - 1 < 1) {
      await this.updateRole({ field: 'email', value: from }, RoleEnum.REGULAR);
    }

    if (toUser.role !== RoleEnum.ADMINISTRATOR && toUser.subordinatesCount + 1 >= 1) {
      await this.updateRole({ field: 'email', value: to }, RoleEnum.BOSS);
    }

    await this.userRepository.update({ [criteria.field]: criteria.value }, { boss: to });
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
