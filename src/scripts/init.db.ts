import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@shared/user';
import { RoleEnum } from '@shared/role';
import { IBaseConfig, IInitConfig } from '@shared/config';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get<ConfigService<IBaseConfig, true>>(ConfigService);
  const initConfig = configService.get<IInitConfig>('init');

  const userRepository = app.get<UserRepository>(UserRepository);
  await userRepository.create(
    userRepository.createInstance({
      ...initConfig,
      boss: null,
      role: RoleEnum.ADMINISTRATOR,
    }),
  );

  await app.close();
}

bootstrap();
