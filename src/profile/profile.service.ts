import { UserRepository } from '@shared/user';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto';


@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getById(id: string) {
    return this.userRepository.findByCriteria({ id });
  }

  async getByEmail(email: string) {
    return this.userRepository.findByCriteria({ email });
  }

  // async getSubordinates() {

  // }

  async create(user: UserDto) {
    await this.userRepository.create({ ...user });
  }
}
