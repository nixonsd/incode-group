import { IsStrongPassword } from 'class-validator';

export interface IAuthConfig {
  accessSecret: string;
  refreshSecret: string;
}

export class AuthConfigValidator implements IAuthConfig {
  @IsStrongPassword()
  readonly accessSecret!: string;

  @IsStrongPassword()
  readonly refreshSecret!: string;
}

export const getAuthConfig = (): IAuthConfig => ({
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
});
