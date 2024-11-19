import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskService } from './task.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './enum/task-status.enum';
import { randomUUID } from 'crypto';
import { FilterTasksByParametersDto } from './dto/filter-tasks-by-parameters.dto';
import { ResponseTaskDto } from './dto/response-task.dto';

describe('TaskService', () => {
  let taksService: TaskService;
  let tasksRepository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    taksService = module.get<TaskService>(TaskService);
    tasksRepository = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  it('must be defined', () => {
    expect(taksService).toBeDefined();
  });

  describe('create', () => {
    it('must create a task', async () => {
      const userId = 'id';
      const createTask = createTaskDto();
      const newTask: TaskEntity = {
        title: createTask.title,
        description: createTask.description,
        expirationDate: createTask.expirationDate,
        status: createTask.status,
        userId: userId,
      };

      const response = await taksService.create(userId, createTask);

      expect(tasksRepository.save).toHaveBeenCalledWith(newTask);
      expect(response).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('must return all tasks', async () => {
      const userId = 'id';
      const taskDto = createTaskDto();
      const tasks: TaskEntity[] = [newTask(taskDto, userId)];
      const params: FilterTasksByParametersDto = {
        limit: 10,
        offset: 0,
      };
      const searshParams: FindOptionsWhere<TaskEntity> = {
        userId: userId,
      };

      jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks);

      const response = await taksService.findAll(userId, params);

      expect(tasksRepository.find).toHaveBeenCalledWith({
        take: params?.limit || 10,
        skip: params?.offset || 0,
        where: searshParams,
      });
      expect(response).toEqual(
        tasks.map(
          (t) =>
            ({
              id: t.id,
              title: t.title,
              description: t.description,
              expirationDate: t.expirationDate,
              status: TaskStatusEnum[t.status],
              userId: t.userId,
            }) as ResponseTaskDto,
        ),
      );
    });
  });

  //   describe('findById', () => {

  //   })
});

const createTaskDto = (data?: Partial<CreateTaskDto>): CreateTaskDto => {
  const createTaskDto: CreateTaskDto = {
    title: data?.title || 'title task',
    description: data?.description || 'description task',
    expirationDate: data?.expirationDate || new Date(),
    status: TaskStatusEnum?.[data?.status] || TaskStatusEnum.TO_DO,
  };

  return createTaskDto;
};

const newTask = (data: CreateTaskDto, userId: string): TaskEntity => {
  const newTask: TaskEntity = {
    id: randomUUID(),
    title: data.title,
    description: data.description,
    expirationDate: data.expirationDate,
    status: data.status,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return newTask;
};
