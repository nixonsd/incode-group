import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IBaseConfig, getBaseConfig } from './shared/config';
import { LoggerModule } from 'nestjs-pino';
import { ILoggerConfig } from '@shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ getBaseConfig ],
    }),
    LoggerModule.forRootAsync({
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService<IBaseConfig, true>) => ({
        pinoHttp: configService.get<ILoggerConfig>('logger'),
      }),
    }),
  ],
  controllers: [ AppController ],
})
export class AppModule {}
