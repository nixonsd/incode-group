import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ActionEnum, RoleEnum, UserAbility } from '@shared/role';
import { User, UserRepository } from '@shared/user';
import { UserDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAbility: UserAbility,
  ) {}

  async create(issuer: User, user: UserDto) {
    const { boss } = user;
    if (!boss)
      throw new BadRequestException('No boss is provided');

    const bossUser = await this.userRepository.get({ field: 'email', value: boss });
    if (!bossUser)
      throw new BadRequestException('Boss is not found');

    const ability = this.userAbility.ofUser(bossUser);
    if (ability.cannot(ActionEnum.Update, User))
      await this.userRepository.updateRole({ field: 'email', value: boss }, RoleEnum.BOSS);

    return this.userRepository.create({ ...user });
  }

  async updateBoss(issuer: User, id: string, boss: string) {
    const subordinate = await this.userRepository.get({ field: 'id', value: id });
    if (!subordinate)
      throw new BadRequestException('Subordinate is not found');

    const ability = this.userAbility.ofUser(issuer);
    if (!ability.can(ActionEnum.Update, subordinate))
      throw new ForbiddenException('Forbidden resource');

    await this.userRepository.setBoss({ field: 'id', value: id }, boss);
  }

  async getById(id: string) {
    const user = await this.userRepository.get({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    return user;
  }

  async getSubordinatesById(id: string) {
    const user = await this.userRepository.getUserWithSubordinates({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    const ability = this.userAbility.ofUser(user);
    if (ability.can(ActionEnum.List, User))
      return this.userRepository.getAll();

    return user;
  }
}
