import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './decorators';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards';
import { AuthDto } from './dto';
import { LoggedRequest, RefreshRequest } from './types';

@Controller('v0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Get('logout')
  async logout(@Req() req: LoggedRequest) {
    await this.authService.logout(req.user.email);
  }

  @Public()
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: RefreshRequest) {
    return this.authService.refreshTokens(req.user.email, req.user.refreshToken);
  }
}
