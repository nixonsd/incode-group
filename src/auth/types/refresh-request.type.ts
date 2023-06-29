import { JwtPayload } from './jwt-payload.type';

export type RefreshRequest = {
  user: JwtPayload & { refreshToken: string };
  [key: string]: unknown;
};
