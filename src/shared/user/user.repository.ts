import { DeepPartial, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ActionEnum, RoleEnum, UserAbility } from '@shared/role';
import { User } from './user.entity';
import { USER_REPOSITORY } from './constants';

export type SelectUserCriteria = {
  field: 'id' | 'email';
  value: string;
};

type RequestResponse = User & { subordinatesCount: number };

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
    private readonly userAbility: UserAbility,
  ) {}

  async create(user: User) {
    const boss = user.boss;
    if (!boss && user.role !== RoleEnum.ADMINISTRATOR)
      throw new Error('User cannot be created');

    if (boss) {
      const ability = this.userAbility.ofUser(boss);
      if (ability.cannot(ActionEnum.Update, user)) {
        boss.role = RoleEnum.BOSS;
        await this.updateRole(user, RoleEnum.BOSS);
      }
    }

    return this.userRepository.save(user);
  }

  async transferSubordinate(subordinate: User, newBoss: User) {
    const oldBoss = Object.assign({}, subordinate.boss);
    if (!oldBoss)
      throw new Error('Cannot change boss of user');

    subordinate.boss = newBoss;
    await this.userRepository.save(subordinate);

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subordinates', 'subordinates')
      .loadRelationCountAndMap('user.subordinatesCount', 'user.subordinates')
      .where('user.email IN (:...emails)', { emails: [ oldBoss.email, newBoss.email ] })
      .getMany();

    const { subordinatesCount: oldBossSubordinateCount } = users.find(({ id }) => id === oldBoss.id) as RequestResponse;
    const { subordinatesCount: newBossSubordinateCount } = users.find(({ id }) => id === newBoss.id) as RequestResponse;

    if (!oldBossSubordinateCount)
      await this.updateRole(oldBoss, RoleEnum.REGULAR);

    if (newBossSubordinateCount)
      await this.updateRole(newBoss, RoleEnum.BOSS);
  }

  async updateRole(user: User, role: RoleEnum) {
    const ability = this.userAbility.ofUser(user);
    if (ability.cannot(ActionEnum.BeChanged, User))
      return;

    return this.userRepository.update({ email: user.email }, this.createInstance({ role }));
  }

  async updateRefreshToken(user: User, refreshToken: string | null) {
    return this.userRepository.update({ email: user.email }, this.createInstance({ refreshToken }));
  }

  async getUserWithRecursiveSubordinates(user: User) {
    return this.userRepository
      .manager
      .getTreeRepository(User)
      .findDescendantsTree(user);
  }

  async exist(criteria: SelectUserCriteria) {
    return this.userRepository.exist({
      where: {
        [criteria.field]: criteria.value,
      },
    });
  }

  async get(criteria: SelectUserCriteria) {
    return this.userRepository.findOne({
      where: {
        [criteria.field]: criteria.value,
      },
      relations: [ 'boss' ],
    });
  }

  async getAll() {
    return this.userRepository.find();
  }

  createInstance(user: DeepPartial<User>) {
    return this.userRepository.create(user);
  }
}
