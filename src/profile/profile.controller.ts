import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LoggedRequest } from '@auth/types';
import { User } from '@shared/user';
import { ActionEnum, AppAbility, CheckPolicies, PoliciesGuard, RoleEnum, Roles, UserAbility } from '@shared/role';
import { UserDto, UserSearchDto } from './dto';
import { ProfileService } from './profile.service';

@Controller('v0/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly userAbility: UserAbility,
  ) {}

  @Get()
  async getCurrentUser(@Req() req: LoggedRequest) {
    return this.profileService.getById(req.user.id);
  }

  @Get('subordinates')
  @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.BOSS)
  async getSubordinates(@Req() req: LoggedRequest) {
    return this.profileService.getSubordinatesById(req.user.id);
  }

  @Get(':id')
  async getUser(@Param() userSearch: UserSearchDto) {
    return this.profileService.getById(userSearch.id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(ActionEnum.Create, User))
  async updateUser(
    @Req() req: LoggedRequest,
    @Param() userSearch: UserSearchDto,
    @Body() user: UserDto,
  ) {
    if (req.)
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ActionEnum.Create, User))
  @HttpCode(HttpStatus.OK)
  async create(@Body() user: UserDto) {
    await this.profileService.create(user);
  }
}
