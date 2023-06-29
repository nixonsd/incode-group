import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IBaseConfig, ILoggerConfig, getBaseConfig } from '@shared/config';
import { LoggerModule } from 'nestjs-pino';
import { ProfileModule } from './profile/profile.module';

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
    ProfileModule,
  ],
  controllers: [ AppController ],
})
export class AppModule {}
