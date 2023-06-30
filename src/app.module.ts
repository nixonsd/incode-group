import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleGuard } from '@shared/role';
import { AuthModule } from '@auth/auth.module';
import { ProfileModule } from '@profile/profile.module';
import { IBaseConfig, ILoggerConfig, getBaseConfig } from '@shared/config';
import { AppController } from './app.controller';
import { AccessTokenGuard } from './auth/guards';

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
    AuthModule,
  ],
  controllers: [ AppController ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
