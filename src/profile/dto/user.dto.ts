import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { RoleEnum } from '@shared/role';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly surname!: string;

  @ApiProperty()
  @IsEmail()
  readonly email!: string;

  @ApiProperty()
  @IsStrongPassword({ minLength: 8 })
  readonly password!: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly bossEmail?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;
}
