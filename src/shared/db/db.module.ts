import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfigValidator, IBaseConfig } from '@shared/config';
import { DATA_SOURCE } from './constants';

@Module({
  providers: [
    {
      provide: DATA_SOURCE,
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService<IBaseConfig, true>) => {
        const dbConfig = configService.get<DatabaseConfigValidator>('database');
        const dataSource = new DataSource({
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.db,
          entities: [
            `${__dirname  }/../**/*.entity{.ts,.js}`,
          ],
          // !! Don't forget to change it back: it synchronize database and can harm prod db
          synchronize: true,
        });

        return dataSource.initialize();
      },
    },
  ],
  exports: [ DATA_SOURCE ],
})
export class DBModule {}
