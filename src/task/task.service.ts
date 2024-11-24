import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksByParametersDto } from './dto/filter-tasks-by-parameters.dto';
import { TaskStatusEnum } from './enum/task-status.enum';
import { ResponseTaskDto } from './dto/response-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async create(userId: string, newTask: CreateTaskDto) {
    const dbTask: TaskEntity = {
      title: newTask.title,
      description: newTask.description,
      expirationDate: newTask.expirationDate,
      status: TaskStatusEnum.TO_DO,
      userId: userId,
    };

    await this.tasksRepository.save(dbTask);
  }

  async findAll(
    userId: string,
    params: FilterTasksByParametersDto,
  ): Promise<ResponseTaskDto[]> {
    const { limit = 10, offset = 0 } = params;

    const searshParams: FindOptionsWhere<TaskEntity> = {
      userId: userId,
    };

    if (params.title) {
      searshParams.title = ILike(`%${params.title}%`);
      // searshParams.title = Raw((alias) => `LOWER(${alias}) LIKE :title`, {
      //   title: `%${params.title.toLowerCase()}%`,
      // });
    }

    if (params.status) {
      searshParams.status = ILike(`%${params.status}%`);
    }

    const tasks = await this.tasksRepository.find({
      take: limit,
      skip: offset,
      where: searshParams,
    });

    return tasks.map((t) => this.mapEntityToDto(t));
  }

  async findById(userId: string, id: string): Promise<ResponseTaskDto> {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(task);
  }

  async update(userId: string, id: string, task: UpdateTaskDto) {
    const taskExists = await this.tasksRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!taskExists) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tasksRepository.update(id, this.mapUpdateDtoToEntity(task));
  }

  async delete(userId: string, id: string) {
    const taskExists = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!taskExists) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tasksRepository.delete({ id, userId });
  }

  private mapEntityToDto(taskEntity: TaskEntity): ResponseTaskDto {
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      expirationDate: taskEntity.expirationDate,
      status: TaskStatusEnum[taskEntity.status],
      userId: taskEntity.userId,
    };
  }

  private mapUpdateDtoToEntity(taksDto: UpdateTaskDto): Partial<TaskEntity> {
    return {
      title: taksDto.title,
      description: taksDto.description,
      expirationDate: taksDto.expirationDate,
      status: TaskStatusEnum[taksDto.status],
    };
  }
}
