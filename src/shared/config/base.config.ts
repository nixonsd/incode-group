import { ValidateNested, validateSync } from 'class-validator';
import { AppConfigValidator, IAppConfig, getAppConfig } from './app.config';
import { Type, plainToClass } from 'class-transformer';
import { ILoggerConfig, LoggerConfigValidator, getLoggerConfig } from './logger.config';
import { DatabaseConfigValidator, IDatabaseConfig, getDatabaseConfig } from './db.config';
import { AuthConfigValidator, IAuthConfig, getAuthConfig } from './auth.config';

export interface IBaseConfig {
  app: IAppConfig;
  auth: IAuthConfig;
  logger: ILoggerConfig;
  database: IDatabaseConfig;
}

export class BaseConfigValidator implements IBaseConfig {
  @ValidateNested()
  @Type(() => AppConfigValidator)
  readonly app!: AppConfigValidator;

  @ValidateNested()
  @Type(() => AuthConfigValidator)
  readonly auth!: AuthConfigValidator;

  @ValidateNested()
  @Type(() => LoggerConfigValidator)
  readonly logger!: LoggerConfigValidator;

  @ValidateNested()
  @Type(() => DatabaseConfigValidator)
  readonly database!: DatabaseConfigValidator;
}

export const getBaseConfig = (): IBaseConfig => {
  const config: IBaseConfig = {
    app: getAppConfig(),
    auth: getAuthConfig(),
    logger: getLoggerConfig(),
    database: getDatabaseConfig(),
  };

  return validate(config);
};

export function validate(config: IBaseConfig): BaseConfigValidator {
  const validatedConfig = plainToClass(
    BaseConfigValidator,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
