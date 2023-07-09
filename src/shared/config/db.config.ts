import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { DEFAULT_POSTGRE_PORT } from './constants';

export interface IDatabaseConfig {
  host: string;
  port: number;
  user?: string;
  password?: string;
  db: string;
  synchronize: boolean;
}

export class DatabaseConfigValidator implements IDatabaseConfig {
  @IsString()
  readonly host!: string;

  @IsNumber()
  readonly port!: number;

  @IsString()
  @IsOptional()
  readonly user?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsString()
  readonly db!: string;

  @IsBoolean()
  readonly synchronize!: boolean;
}

export const getDatabaseConfig = (): IDatabaseConfig => ({
  host: process.env.POSTGRE_HOST as string,
  port: parseInt(`${process.env.POSTGRE_PORT ?? DEFAULT_POSTGRE_PORT}`, 10),
  user: process.env.POSTGRE_USER,
  password: process.env.POSTGRE_PASS,
  db: process.env.POSTGRE_DATABASE as string,
  synchronize: process.env.POSTGRE_SYNCHRONIZE === 'true' ? true : false,
});
