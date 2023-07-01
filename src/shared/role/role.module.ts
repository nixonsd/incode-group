import { Module } from '@nestjs/common';
import { UserAbility } from './abilities';

@Module({
  providers: [ UserAbility ],
  exports: [ UserAbility ],
})
export class RoleModule {}
