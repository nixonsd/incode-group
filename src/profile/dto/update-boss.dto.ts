import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateBossDto {
  @ApiProperty()
  @IsEmail()
  readonly bossEmail!: string;
}
