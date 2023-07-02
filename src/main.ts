import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IAppConfig, IBaseConfig } from '@shared/config';
import { AppModule } from './app.module';
import { configureMiddleware } from './configure-middleware';
import { configureAppDocs } from './configure-app-docs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const configService = app.get<ConfigService<IBaseConfig, true>>(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  configureMiddleware(app);
  configureAppDocs(app, 'NFT Metadata Indexer API Docs');

  const { port, listenHost } = appConfig;

  if (listenHost)
    await app.listen(port, listenHost);
  else
    await app.listen(port);

  app.get(Logger).log(`Server is running at ${listenHost || 'localhost'}:${port} 🚀`, 'NestApplication');
}

bootstrap();
