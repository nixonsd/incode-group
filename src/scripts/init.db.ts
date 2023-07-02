import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '@shared/role';
import { IBaseConfig } from '@shared/config';
import { UserRepository } from '@shared/user';
import { IInitConfig } from '@shared/config/init.config';
import { AppModule } from '../app.module';

async function run() {
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

run();
