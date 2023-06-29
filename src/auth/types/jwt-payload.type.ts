import { Roles } from '@shared/role';

export type JwtPayload = {
  id: string;
  name: string;
  email: string;
  role: Roles;
};
