import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserSearchDto {
  @ApiProperty()
  @IsUUID()
  readonly id!: string;
}
