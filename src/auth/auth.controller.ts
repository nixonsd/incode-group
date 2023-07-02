import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './decorators';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards';
import { AuthDto } from './dto';
import { AuthOkResponseItem, LoggedRequest, RefreshRequest } from './types';
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
import { BadRequestException, InternalServerException, NotFoundEx, UnauthorizedException } from '@shared/response-exception';

@ApiTags('Auth')
@Controller('v0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse({
    description: HttpStatusCodeDescription.BAD_REQUEST,
    type: BadRequestException,
  })
  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: AuthOkResponseItem,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiNotFoundResponse({
    description: HttpStatusCodeDescription.NOT_FOUND,
    type: NotFoundEx,
  })
  @ApiOperation({
    summary: 'Authenticate as a user',
  })
  @ApiExtraModels(AuthDto, AuthOkResponseItem)
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthDto): Promise<AuthOkResponseItem> {
    const keys = await this.authService.signIn(authDto);

    return {
      accessToken: keys[0],
      refreshToken: keys[1],
    };
  }

  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
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
    summary: 'Logout from account',
  })
  @Get('logout')
  async logout(@Req() req: LoggedRequest) {
    await this.authService.logout(req.user.email);
  }

  @ApiOkResponse({
    description: HttpStatusCodeDescription.SUCCESS,
    type: AuthOkResponseItem,
  })
  @ApiInternalServerErrorResponse({
    description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
    type: InternalServerException,
  })
  @ApiOperation({
    summary: 'Refresh user\'s access and refresh keys',
  })
  @ApiExtraModels(AuthOkResponseItem)
  @Public()
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: RefreshRequest): Promise<AuthOkResponseItem> {
    const keys = await this.authService.refreshTokens(req.user.email, req.user.refreshToken);

    return {
      accessToken: keys[0],
      refreshToken: keys[1],
    };
  }
}
