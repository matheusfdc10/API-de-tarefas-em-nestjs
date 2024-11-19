import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteTaskDocument() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'delete a user task by id' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Task deleted',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Task with id not found',
    }),
    ApiParam({
      name: 'id',
      description: 'task id',
      required: true,
    }),
  );
}
