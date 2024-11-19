import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'to study',
    description: 'Task title',
    minLength: 3,
    maxLength: 256,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Study nestjs and reactjs',
    description: 'Task description',
    minLength: 5,
    maxLength: 512,
    required: true,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(512)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: TaskStatusEnum.TO_DO,
    description: 'Task status',
    required: false,
    enum: TaskStatusEnum,
  })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: new Date(),
    description: 'Task expiration date',
    required: true,
    type: Date,
  })
  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;
}
