import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from './dto';
import { ProfileService } from './profile.service';

@Controller('v0/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getCurrentUser() {
    return this.profileService.getById('320db00c-e885-4a46-bce9-a888572c180b');
  }

  // @Get(':id')
  // async getById(@Query('id') id: string) {

  // }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() user: UserDto) {
    await this.profileService.create(user);
  }

  // const roles = await this.roleRepository.getAll();

  // const user = new User();
  // Object.assign(user, { name: 'Bohdanchik', role: roles[0], boss: user });
  // console.log(user);
  // await this.userRepository.create(user);

  // return this.userRepository.getAll();


}
