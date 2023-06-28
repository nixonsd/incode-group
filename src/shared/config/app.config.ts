import { IsIP, IsOptional, IsPort, IsSemVer } from 'class-validator';

export interface IAppConfig {
  version: string;
  port: string;
  listenHost?: string;
}

export class AppConfigValidator implements IAppConfig {
  @IsSemVer()
  readonly version!: string;

  @IsPort()
  readonly port!: string;

  @IsIP()
  @IsOptional()
  readonly listenHost?: string;
}

export const getAppConfig = (): IAppConfig => ({
  version: process.env.APP_VERSION as string,
  port: process.env.APP_PORT ?? '3000',
  listenHost: process.env.APP_LISTEN as string,
});
