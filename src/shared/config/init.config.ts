import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export interface IInitConfig {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export class InitConfigValidator implements IInitConfig {
  @IsString()
  readonly name!: string;

  @IsString()
  readonly surname!: string;

  @IsEmail()
  readonly email!: string;

  @IsStrongPassword()
  readonly password!: string;
}

export const getInitConfig = (): IInitConfig => ({
  name: process.env.INIT_ADMIN_NAME as string,
  surname: process.env.INIT_ADMIN_SURNAME as string,
  email: process.env.INIT_ADMIN_EMAIL as string,
  password: process.env.INIT_ADMIN_PASSWORD as string,
});
