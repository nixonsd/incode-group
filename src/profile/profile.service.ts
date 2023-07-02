import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ActionEnum, RoleEnum, UserAbility } from '@shared/role';
import { User, UserRepository } from '@shared/user';
import { CreateUserDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAbility: UserAbility,
  ) {}

  async create(issuer: User, user: CreateUserDto) {
    let { boss } = user;
    if (!boss)
      boss = issuer.email;

    const bossUser = await this.userRepository.get({ field: 'email', value: boss });
    if (!bossUser)
      throw new BadRequestException('Boss is not found');

    const ability = this.userAbility.ofUser(bossUser);
    const userInstance = this.userRepository.createInstance(user);
    if (ability.cannot(ActionEnum.Update, userInstance))
      await this.userRepository.updateRole({ field: 'email', value: boss }, RoleEnum.BOSS);

    return this.userRepository.create(
      this.userRepository.createInstance({ ...user, boss }),
    );
  }

  async updateBoss(issuer: User, id: string, boss: string) {
    const subordinate = await this.userRepository.get({ field: 'id', value: id });
    if (!subordinate)
      throw new NotFoundException('Subordinate is not found');
    if (!subordinate.boss)
      throw new BadRequestException('Boss cannot be changed');

    const issuerAbility = this.userAbility.ofUser(issuer);
    if (issuerAbility.cannot(ActionEnum.Update, subordinate))
      throw new ForbiddenException('Forbidden resource');

    await this.userRepository.transferSubordinate({ field: 'id', value: id }, subordinate.boss, boss);
  }

  async getById(id: string) {
    const user = await this.userRepository.get({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    return user;
  }

  async getSubordinatesById(issuer: User, id: string) {
    const user = await this.userRepository.getUserWithSubordinates({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    const ability = this.userAbility.ofUser(user);
    if (ability.can(ActionEnum.List, User))
      return this.userRepository.getAll();

    return user;
  }

  async onSubordinate(bossId: string) {
    const boss = await this.userRepository.getUserWithSubordinates({ field: 'id', value: bossId });
    if (!boss)
      throw new NotFoundException('Boss is not found');

    if (!boss?.subordinates?.length) {
      boss.role = RoleEnum.REGULAR;
    }

    if (boss?.subordinates?.length && boss.role === RoleEnum.REGULAR)
      boss.role = RoleEnum.BOSS;
    await this.userRepository.updateRole({ field: 'id', value: bossId }, RoleEnum.BOSS);
  }
}
