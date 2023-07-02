import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IBaseConfig } from '@shared/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@auth/decorators';

@ApiTags('Auxiliary')
@Controller()
export class AppController {
  private readonly appConfig: IAppConfig;

  constructor(
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    private readonly configService: ConfigService<IBaseConfig, true>,
  ) {
    this.appConfig = this.configService.get<IAppConfig>('app');
  }

  @ApiOperation({
    summary: 'Check application health',
  })
  @Public()
  @Get('health')
  health(): string{
    return 'OK';
  }

  @ApiOperation({
    summary: 'Check application version',
  })
  @Public()
  @Get('version')
  version(): string {
    return this.appConfig.version;
  }
}
