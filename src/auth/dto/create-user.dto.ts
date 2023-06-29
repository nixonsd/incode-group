import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

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
  readonly boss!: string;
}
