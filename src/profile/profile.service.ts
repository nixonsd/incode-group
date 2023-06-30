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

  async getByEmail(email: string) {
    return this.userRepository.findByCriteria({ email });
  }

  async create(user: UserDto) {
    await this.userRepository.create({ ...user });
  }
}
