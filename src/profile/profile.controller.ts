import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { LoggedRequest } from '@auth/types';
import { RoleEnum, Roles } from '@shared/role';
import { UserDto, UserSearchDto } from './dto';
import { ProfileService } from './profile.service';

@Controller('v0/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getCurrentUser(@Req() req: LoggedRequest) {
    return this.profileService.getById(req.user.id);
  }

  @Get(':id')
  async getUser(@Param() userSearch: UserSearchDto) {
    return this.profileService.getById(userSearch.id);
  }

  @Get('subordinates')
  @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.BOSS)
  async getSubordinates(@Req() req: LoggedRequest) {
    return this.profileService.getSubordinatesById(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() user: UserDto) {
    await this.profileService.create(user);
  }
}
