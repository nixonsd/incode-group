import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '@shared/user';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [ ProfileController ],
  providers: [ ProfileService ],
})
export class ProfileModule {}
