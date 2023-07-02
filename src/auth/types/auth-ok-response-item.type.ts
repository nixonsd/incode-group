import { ApiProperty } from '@nestjs/swagger';

export class AuthOkResponseItem {
  @ApiProperty()
  readonly  accessToken!: string;

  @ApiProperty()
  readonly  refreshToken!: string;
}
