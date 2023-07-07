import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User, UserRepository } from '@shared/user';
import { IAuthConfig, IBaseConfig } from '@shared/config';
import { JwtPayload } from './types';
import { AuthDto } from './dto';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from './constants';

@Injectable()
export class AuthService {
  private readonly authConfig: IAuthConfig;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<IBaseConfig, true>,
    private readonly jwtService: JwtService,
  ) {
    this.authConfig = this.configService.get<IAuthConfig>('auth');
  }

  async logout(email: string) {
    const user = await this.userRepository.get({ field: 'email', value: email });
    if (!user)
      throw new BadRequestException('Logout incorrect data');

    return this.userRepository.updateRefreshToken(user, null);
  }

  async signIn(authDto: AuthDto) {
    const user = await this.userRepository.get({ field: 'email', value: authDto.email });
    if (!user)
      throw new BadRequestException('User does not exist');

    const passwordMatchers = await User.verifyHash(authDto.password, user.password);
    if (!passwordMatchers)
      throw new BadRequestException('Password is incorrect');

    const { id, name, role, email } = user;
    const jwtPayload: JwtPayload = { id, name, role, email };

    const accessToken = await this.getAccessToken(jwtPayload);
    const refreshToken = await this.getRefreshToken(jwtPayload);

    await this.userRepository.updateRefreshToken(user, refreshToken);

    return [ accessToken, refreshToken ];
  }

  async refreshTokens(email: string, refreshTokenOld: string) {
    const user = await this.userRepository.get({ field: 'email', value: email });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatchers = await User.verifyHash(refreshTokenOld, user.refreshToken);
    if (!refreshTokenMatchers)
      throw new ForbiddenException('Access Denied');

    const { id, name, role } = user;
    const jwtPayload: JwtPayload = { id, name, role, email };

    const accessToken = await this.getAccessToken(jwtPayload);
    const refreshToken = await this.getRefreshToken(jwtPayload);

    await this.userRepository.updateRefreshToken(user, refreshToken);

    return [ accessToken, refreshToken ];
  }

  async getAccessToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.authConfig.accessSecret,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  }

  async getRefreshToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.authConfig.refreshSecret,
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }
}
