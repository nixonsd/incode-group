import { IsIP, IsNumber, IsOptional, IsSemVer } from 'class-validator';
import { DEFAULT_APP_PORT } from './constants';

export interface IAppConfig {
  version: string;
  port: number;
  listenHost?: string;
}

export class AppConfigValidator implements IAppConfig {
  @IsSemVer()
  readonly version!: string;

  @IsNumber()
  readonly port!: number;

  @IsIP()
  @IsOptional()
  readonly listenHost?: string;
}

export const getAppConfig = (): IAppConfig => ({
  version: process.env.APP_VERSION as string,
  port: parseInt(`${process.env.APP_PORT ?? DEFAULT_APP_PORT}`, 10),
  listenHost: process.env.APP_LISTEN as string,
});
