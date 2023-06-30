import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor, TransformInterceptor } from '@shared/interceptors';

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

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
};
