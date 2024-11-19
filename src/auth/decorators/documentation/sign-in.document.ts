import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';

export function SignInDocument() {
  return applyDecorators(
    ApiOperation({ summary: 'user login' }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'UserName or Password invalid',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Logged in user',
      type: AuthResponseDto,
    }),
  );
}
