import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ACCESS_TOKEN_EXPIRATION_TIME = '15m';
export const REFRESH_TOKEN_EXPIRATION_TIME = '7d';