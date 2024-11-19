import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskStatusEnum } from '../enum/task-status.enum';

export class FilterTasksByParametersDto extends PaginationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  title?: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: string;
}
