import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthRequestDto } from 'src/auth/dto/auth-request.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/constants';
import { FilterTasksByParametersDto } from './dto/filter-tasks-by-parameters.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { CreateTaskDocument } from './decorators/documentation/create-task.document';
import { FindAllTaskDocument } from './decorators/documentation/find-all-tasks.document';
import { FindByIdTaskDocument } from './decorators/documentation/find-by-id-task.document';
import { UpdateTaskDocument } from './decorators/documentation/update-task.document';
import { DeleteTaskDocument } from './decorators/documentation/delete-task.document';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @CreateTaskDocument()
  async create(
    @Request() request: AuthRequestDto,
    @Body() task: CreateTaskDto,
  ) {
    const userId = request[REQUEST_TOKEN_PAYLOAD_KEY].sub;
    await this.taskService.create(userId, task);
  }

  @Get()
  @FindAllTaskDocument()
  async findAll(
    @Request() request: AuthRequestDto,
    @Query() params: FilterTasksByParametersDto,
  ): Promise<ResponseTaskDto[]> {
    const userId = request[REQUEST_TOKEN_PAYLOAD_KEY].sub;
    return await this.taskService.findAll(userId, params);
  }

  @Get('/:id')
  @FindByIdTaskDocument()
  async findById(
    @Request() request: AuthRequestDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseTaskDto> {
    const userId = request[REQUEST_TOKEN_PAYLOAD_KEY].sub;
    return await this.taskService.findById(userId, id);
  }

  @Put('/:id')
  @UpdateTaskDocument()
  async update(
    @Request() request: AuthRequestDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() task: UpdateTaskDto,
  ) {
    const userId = request[REQUEST_TOKEN_PAYLOAD_KEY].sub;
    await this.taskService.update(userId, id, task);
  }

  @Delete('/:id')
  @DeleteTaskDocument()
  async delete(
    @Request() request: AuthRequestDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = request[REQUEST_TOKEN_PAYLOAD_KEY].sub;
    await this.taskService.delete(userId, id);
  }
}
