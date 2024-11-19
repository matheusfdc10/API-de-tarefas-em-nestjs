import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function CreateUserDocument() {
  return applyDecorators(
    ApiTags('Users'),
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User successfully created',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Username already exists',
    }),
  );
}
