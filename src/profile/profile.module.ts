import { Module } from '@nestjs/common';
import { UserModule } from '@shared/user';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { RoleModule } from '@/shared/role';

@Module({
  imports: [
    RoleModule,
    UserModule,
  ],
  controllers: [ ProfileController ],
  providers: [ ProfileService ],
})
export class ProfileModule {}
