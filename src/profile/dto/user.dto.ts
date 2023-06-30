import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { RoleEnum } from '@shared/role';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly surname!: string;

  @IsEmail()
  readonly email!: string;

  @IsStrongPassword({ minLength: 8 })
  readonly password!: string;

  @IsEmail()
  readonly boss!: string;

  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;
}
