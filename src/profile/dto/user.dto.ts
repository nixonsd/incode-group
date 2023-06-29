import { Roles } from '@/shared/roles';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

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

  @IsEnum(Roles)
  readonly role?: Roles;
}
