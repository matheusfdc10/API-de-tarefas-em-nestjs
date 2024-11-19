import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'udybsadiuasbduysabdiuasbdiasubdasiudb',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: new Date().getTime(),
    description: 'expires In',
  })
  expiresIn: number;
}
