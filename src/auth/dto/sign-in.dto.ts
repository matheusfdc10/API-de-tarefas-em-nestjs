import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { NoSpaces } from 'src/common/validators/no-spaces.decorator';

export class SignInDto {
  @ApiProperty({
    example: 'jhon123',
    description: 'user name do usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @NoSpaces()
  userName: string;

  @ApiProperty({
    example: 'password123',
    description: 'password do usuario',
    minLength: 8,
    maxLength: 256,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @NoSpaces()
  password: string;
}
