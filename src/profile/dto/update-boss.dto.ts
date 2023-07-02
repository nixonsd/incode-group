import { IsEmail } from 'class-validator';

export class UpdateBossDto {
  @IsEmail()
  readonly bossEmail!: string;
}
