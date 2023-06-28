import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IBaseConfig } from '@shared/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  private readonly appConfig: IAppConfig;

  constructor(
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    private readonly configService: ConfigService<IBaseConfig, true>,
  ) {
    this.appConfig = this.configService.get<IAppConfig>('app');
  }

  @Get('health')
  health(): string {
    return 'OK';
  }

  @Get('version')
  version(): string {
    return this.appConfig.version;
  }
}
