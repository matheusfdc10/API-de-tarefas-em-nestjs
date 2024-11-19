import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseTaskDto } from 'src/task/dto/response-task.dto';

export function FindByIdTaskDocument() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'finds user task by id' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'returns the user task',
      type: ResponseTaskDto,
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
