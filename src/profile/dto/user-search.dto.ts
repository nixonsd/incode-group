import { IsUUID } from 'class-validator';

export class UserSearchDto {
  @IsUUID()
  readonly id!: string;
}
