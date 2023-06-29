import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { ResponseInterceptor } from './response.interceptor';

/**
 * Configures API middleware functions
 *
 * @param {NestExpressApplication} app
 */
export const configureMiddleware = (app: NestExpressApplication): void => {
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.set('trust proxy', 1);
  app.enableCors();

  app.use(helmet());
  app.use(compression());

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new ResponseInterceptor());
};
