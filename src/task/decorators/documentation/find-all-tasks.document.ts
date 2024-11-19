import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseTaskDto } from 'src/task/dto/response-task.dto';
import { TaskStatusEnum } from 'src/task/enum/task-status.enum';

export function FindAllTaskDocument() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'find all user tasks' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'returned all user tasks',
      type: [ResponseTaskDto],
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      example: 0,
      description: 'Items to skip',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Limit of items per page',
    }),
    ApiQuery({
      name: 'title',
      required: false,
      example: 'stud',
      description: 'Search by task title',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      example: TaskStatusEnum.TO_DO,
      enum: TaskStatusEnum,
      description: 'Search by task status',
    }),
  );
}
