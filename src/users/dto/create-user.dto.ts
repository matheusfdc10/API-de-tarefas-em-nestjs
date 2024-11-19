import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { NoSpaces } from 'src/common/validators/no-spaces.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'jhon123',
    description: 'user name do usuario',
    minLength: 3,
    maxLength: 24,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(24)
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
  @MinLength(8)
  @MaxLength(256)
  @IsNotEmpty()
  @NoSpaces()
  password: string;
}
