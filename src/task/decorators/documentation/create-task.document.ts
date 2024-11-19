import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateTaskDocument() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new task' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Task successfully created',
    }),
  );
}
