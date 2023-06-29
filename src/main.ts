import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IBaseConfig } from '@shared/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureMiddleware } from './configure-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const configService = app.get<ConfigService<IBaseConfig, true>>(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  const { port, listenHost } = appConfig;

  configureMiddleware(app);

  if (listenHost) {
    await app.listen(port, listenHost);
  } else {
    await app.listen(port);
  }

  app.get(Logger).log(`Server is running at ${listenHost || 'localhost'}:${port} 🚀`, 'NestApplication');
}

bootstrap();
