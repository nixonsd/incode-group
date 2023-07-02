import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { RoleEnum } from '@shared/role';

export class CreateUserDto {
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
  @IsOptional()
  readonly boss?: string | null;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;
}
