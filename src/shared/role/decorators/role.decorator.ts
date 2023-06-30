import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../role.enum';
import { IS_ROLE } from '../constants';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(IS_ROLE, roles);
