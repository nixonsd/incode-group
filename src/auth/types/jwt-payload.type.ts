import { Roles } from '@shared/roles';

export type JwtPayload = {
  id: string;
  name: string;
  email: string;
  role: Roles;
};
