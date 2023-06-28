import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IBaseConfig } from '@shared/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get<ConfigService<IBaseConfig, true>>(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  const { port, listenHost } = appConfig;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (listenHost) {
    await app.listen(port, listenHost);
  } else {
    await app.listen(port);
  }

  app.get(Logger).log(`Server is running at ${listenHost || 'localhost'}:${port} 🚀`, 'NestApplication');
}

bootstrap();
