import { Module } from '@nestjs/common';
import { DATA_SOURCE, DBModule } from '@shared/db';
import { USER_REPOSITORY } from './constants';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [ DBModule ],
  providers: [
    {
      provide: USER_REPOSITORY,
      inject: [ DATA_SOURCE ],
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    },
    UserRepository,
  ],
  exports: [ UserRepository ],
})
export class UserModule {}
