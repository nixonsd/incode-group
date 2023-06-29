import { User, UserRepository } from '@shared/user';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, CreateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { IAuthConfig, IBaseConfig } from '@shared/config';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from './constants';

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

  async signUp(createUserDto: CreateUserDto) {
    const exist = await this.userRepository.exist({ email: createUserDto.email });
    if (exist) {
      throw new BadRequestException('User already exists');
    }

    const { id, name, role, email } = await this.userRepository.create(createUserDto);
    const jwtPayload: JwtPayload = { id, name, role, email };

    const accessToken = await this.getAccessToken(jwtPayload);
    const refreshToken = await this.getRefreshToken(jwtPayload);

    await this.userRepository.update({ id }, { refreshToken });

    return [ accessToken, refreshToken ];
  }

  async logout(userId: string) {
    return this.userRepository.update({ id: userId }, { refreshToken: null });
  }

  async signIn(authDto: AuthDto) {
    const user = await this.userRepository.findByCriteria({ email: authDto.email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatchers = await User.verifyHash(authDto.password, user.password);
    if (!passwordMatchers) {
      throw new BadRequestException('Password is incorrect');
    }

    const { id, name, role, email } = user;
    const jwtPayload: JwtPayload = { id, name, role, email };

    const accessToken = await this.getAccessToken(jwtPayload);
    const refreshToken = await this.getRefreshToken(jwtPayload);

    await this.userRepository.update({ id: user.id }, { refreshToken });

    return [ accessToken, refreshToken ];
  }

  async refreshTokens(userId: string, refreshTokenOld: string) {
    const user = await this.userRepository.findByCriteria({ id: userId });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatchers = await User.verifyHash(refreshTokenOld, user.refreshToken);
    if (!refreshTokenMatchers) {
      throw new ForbiddenException('Access Denied');
    }

    const { id, name, role, email } = user;
    const jwtPayload: JwtPayload = { id, name, role, email };

    const accessToken = await this.getAccessToken(jwtPayload);
    const refreshToken = await this.getRefreshToken(jwtPayload);

    await this.userRepository.update({ id }, { refreshToken });

    return [ accessToken, refreshToken ];
  }

  async getAccessToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.authConfig.accessSecret,
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  async getRefreshToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.authConfig.refreshSecret,
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }
}
