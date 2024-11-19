import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { randomUUID } from 'crypto';

export class ResponseTaskDto {
  @ApiProperty({
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    example: 'to study',
  })
  title: string;

  @ApiProperty({
    example: 'Study nestjs and reactjs',
  })
  description: string;

  @ApiProperty({
    example: new Date(),
    type: Date,
  })
  expirationDate: Date;

  @ApiProperty({
    example: TaskStatusEnum.TO_DO,
    enum: TaskStatusEnum,
  })
  status: TaskStatusEnum;

  @ApiProperty({
    example: randomUUID(),
  })
  userId: string;
}
