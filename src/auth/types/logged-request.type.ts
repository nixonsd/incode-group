import { JwtPayload } from './jwt-payload.type';

export type LoggedRequest = {
  user: JwtPayload;
  [key: string]: unknown;
};
