import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleEnum, UserAbility } from '@shared/role';
import { UserRepository } from '@shared/user';
import { UserDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAbility: UserAbility,
  ) {}

  async create(user: UserDto) {
    const { boss, role } = user;
    if (boss === null && role !== RoleEnum.ADMINISTRATOR)
      throw new BadRequestException('User must have a boss or be an administrator');

    if (boss === null)
      throw new BadRequestException('Provide boss of the user');

    const bossUser = await this.userRepository.get({ field: 'email', value: boss });
    if (!bossUser)
      throw new BadRequestException('Boss is not found');

    if (bossUser.role === RoleEnum.REGULAR)
      await this.userRepository.updateRole({ field: 'email', value: boss }, RoleEnum.BOSS);

    await this.userRepository.create({ ...user });
  }

  async getById(id: string) {
    const user = await this.userRepository.get({ field: 'id', value: id });

    if (!user)
      throw new NotFoundException('User is not found');

    // const ability = this.userChangeAbility.ofUser(user);
    // if (ability.can(ActionEnum.Manage, user)) {
    //   console.log('Yes he can!');
    // } else {
    //   console.log('No he cannot');
    // }


    return user;
  }

  async getSubordinatesById(id: string) {
    const user = await this.userRepository.getUserWithSubordinates({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    if (user.role === RoleEnum.ADMINISTRATOR) {
      return this.userRepository.getAll();
    }

    return user;
  }
}
