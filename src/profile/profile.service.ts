import { Injectable } from '@nestjs/common';
import { UserRepository } from '@shared/user';
import { UserDto } from './dto';


@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getById(id: string) {
    return this.userRepository.findByCriteria({ id });
  }

  async getSubordinatesById(id: string) {
    return this.userRepository.getSubordinates({ id });
  }

  async create(user: UserDto) {
    await this.userRepository.create({ ...user });
  }
}
