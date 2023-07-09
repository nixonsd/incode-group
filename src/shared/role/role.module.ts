import { Module, forwardRef } from '@nestjs/common';
import { UserAbility } from './abilities';
import { UserModule } from '../user';

@Module({
  imports: [ forwardRef(() => UserModule) ],
  providers: [ UserAbility ],
  exports: [ UserAbility ],
})
export class RoleModule {}
