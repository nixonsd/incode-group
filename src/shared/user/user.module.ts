import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { RoleModule } from '@shared/role';
import { DATA_SOURCE, DBModule } from '@shared/db';
import { User } from './user.entity';
import { USER_REPOSITORY } from './constants';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    DBModule,
    RoleModule,
  ],
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
