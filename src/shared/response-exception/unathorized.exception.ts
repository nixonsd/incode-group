import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedException{
  @ApiProperty({ enum: HttpStatus, default: HttpStatus.UNAUTHORIZED })
    statusCode = HttpStatus;

  @ApiProperty()
    message!: string;
}
