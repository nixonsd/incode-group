import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './constants';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';
import { LoggedRequest, RefreshRequest } from './types';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

@Controller('v0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @UseGuards(AccessTokenGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: LoggedRequest) {
    await this.authService.logout(req.user.id);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: RefreshRequest) {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }
}
