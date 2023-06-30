import { Module } from '@nestjs/common';
import { UserModule } from '@shared/user';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [ ProfileController ],
  providers: [ ProfileService ],
})
export class ProfileModule {}
