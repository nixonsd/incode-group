import { IsOptional, IsString } from 'class-validator';

export interface ILoggerConfig {
  level: string;
  transport?: any;
}

export class LoggerConfigValidator implements ILoggerConfig {
  @IsString()
  readonly level!: string;

  @IsOptional()
  readonly transport?: any;
}

export const getLoggerConfig = (): ILoggerConfig => ({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});
