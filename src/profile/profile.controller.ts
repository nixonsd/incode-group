import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoggedRequest } from '@auth/types';
import { User, UserRepository } from '@shared/user';
import { ActionEnum, AppAbility, CheckPolicies, PoliciesGuard } from '@shared/role';
import { CreateUserDto, UserSearchDto } from './dto';
import { ProfileService } from './profile.service';
import { UpdateBossDto } from './dto/update-boss.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatusCodeDescription } from '@shared/response';
import { BadRequestException, InternalServerException, NotFoundEx } from '@shared/response-exception';

@ApiTags('Profile')
@Controller('v0/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userRepository: UserRepository,
  ) {}

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiNotFoundResponse({
    description: HttpStatusCodeDescription.NOT_FOUND,
    type: NotFoundEx,
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusCodeDescription.UNAUTHORIZED_ACCESS,
    type: UnauthorizedException,
  })
  @ApiBearerAuth('JWT Authentication')
  @ApiOperation({
    summary: 'Get current logged-in user info',
  })
  @ApiExtraModels(User)
  @Get()
  async getCurrentUser(@Req() req: LoggedRequest) {
    return this.profileService.getById(req.user.id);
  }

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiNotFoundResponse({
    description: HttpStatusCodeDescription.NOT_FOUND,
    type: NotFoundEx,
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusCodeDescription.UNAUTHORIZED_ACCESS,
    type: UnauthorizedException,
  })
  @ApiBearerAuth('JWT Authentication')
  @ApiOperation({
    summary: 'Get subordinates of user',
  })
  @ApiExtraModels(UserSearchDto, User)
  @Get(':id/subordinates')
  async getSubordinates(@Req() req: LoggedRequest, @Param() userSearch: UserSearchDto) {
    return this.profileService.getSubordinatesById(
      this.userRepository.createInstance(req.user),
      userSearch.id);
  }

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiNotFoundResponse({
    description: HttpStatusCodeDescription.NOT_FOUND,
    type: NotFoundEx,
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusCodeDescription.UNAUTHORIZED_ACCESS,
    type: UnauthorizedException,
  })
  @ApiBearerAuth('JWT Authentication')
  @ApiOperation({
    summary: 'Get user data by id',
  })
  @ApiExtraModels(UserSearchDto, User)
  @Get(':id')
  async getUser(@Param() userSearch: UserSearchDto) {
    return this.profileService.getById(userSearch.id);
  }

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiNotFoundResponse({
    description: HttpStatusCodeDescription.NOT_FOUND,
    type: NotFoundEx,
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusCodeDescription.UNAUTHORIZED_ACCESS,
    type: UnauthorizedException,
  })
  @ApiBearerAuth('JWT Authentication')
  @ApiOperation({
    summary: 'Update user\'s boss',
  })
  @ApiExtraModels(UserSearchDto, User, UpdateBossDto)
  @Patch(':id/boss')
  async updateBoss(@Req() req: LoggedRequest, @Param() userSearch: UserSearchDto, @Body() updateBoss: UpdateBossDto) {
    return this.profileService.updateBoss(
      this.userRepository.createInstance(req.user),
      userSearch.id,
      updateBoss.bossEmail,
    );
  }

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusCodeDescription.UNAUTHORIZED_ACCESS,
    type: UnauthorizedException,
  })
  @ApiBearerAuth('JWT Authentication')
  @ApiOperation({
    summary: 'Create new user account',
  })
  @ApiExtraModels(CreateUserDto, User)
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
