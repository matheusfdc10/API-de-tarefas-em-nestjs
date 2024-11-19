import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function UpdateTaskDocument() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'update user task' }),
    ApiParam({
      name: 'id',
      description: 'task id',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'updated task',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'task not found',
    }),
  );
}
