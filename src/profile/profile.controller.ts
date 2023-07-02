import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LoggedRequest } from '@auth/types';
import { User, UserRepository } from '@shared/user';
import { ActionEnum, AppAbility, CheckPolicies, PoliciesGuard } from '@shared/role';
import { CreateUserDto, UserSearchDto } from './dto';
import { ProfileService } from './profile.service';
import { UpdateBossDto } from './dto/update-boss.dto';

@Controller('v0/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  async getCurrentUser(@Req() req: LoggedRequest) {
    return this.profileService.getById(req.user.id);
  }

  @Get('subordinates')
  async getSubordinates(@Req() req: LoggedRequest) {
    return this.profileService.getSubordinatesById(req.user.id);
  }

  @Get(':id')
  async getUser(@Param() userSearch: UserSearchDto) {
    return this.profileService.getById(userSearch.id);
  }

  @Patch(':id/boss')
  async updateBoss(@Req() req: LoggedRequest, @Param() userSearch: UserSearchDto, @Body() updateBoss: UpdateBossDto) {
    return this.profileService.updateBoss(
      this.userRepository.createInstance(req.user),
      userSearch.id,
      updateBoss.bossEmail,
    );
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ActionEnum.Create, User))
  @HttpCode(HttpStatus.OK)
  async create(@Req() req: LoggedRequest, @Body() user: CreateUserDto) {
    return this.profileService.create(
      this.userRepository.createInstance(req.user),
      user,
    );
  }
}
