import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ActionEnum, UserAbility } from '@shared/role';
import { User, UserRepository } from '@shared/user';
import { CreateUserDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAbility: UserAbility,
  ) {}

  async create(issuer: User, user: CreateUserDto) {
    let { bossEmail } = user;
    if (!bossEmail)
      bossEmail = issuer.email;

    const bossUser = await this.userRepository.get({ field: 'email', value: bossEmail });
    if (!bossUser)
      throw new BadRequestException('Boss is not found');

    const userInstance = this.userRepository.createInstance({ ...user, boss: bossUser });

    return this.userRepository.create(userInstance);
  }

  async updateBoss(issuer: User, id: string, bossEmail: string) {
    const subordinate = await this.userRepository.get({ field: 'id', value: id });
    if (!subordinate)
      throw new NotFoundException('Subordinate is not found');

    const issuerAbility = this.userAbility.ofUser(issuer);
    if (issuerAbility.cannot(ActionEnum.Update, subordinate))
      throw new ForbiddenException('Forbidden resource');

    const newBoss = await this.userRepository.get({ field: 'email', value: bossEmail });
    if (!newBoss)
      throw new BadRequestException('Boss is not found');

    await this.userRepository.transferSubordinate(subordinate, newBoss);
  }

  async getById(id: string) {
    const user = await this.userRepository.get({ field: 'id', value: id });
    if (!user)
      throw new NotFoundException('User is not found');

    return user;
  }

  async getSubordinatesOfIssuer(issuer: User) {
    const user = await this.userRepository.getUserWithRecursiveSubordinates(issuer);

    const ability = this.userAbility.ofUser(issuer);
    if (ability.can(ActionEnum.List, User))
      return this.userRepository.getAll();

    return user;
  }
}
