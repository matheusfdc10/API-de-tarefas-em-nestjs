import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskService } from './task.service';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './enum/task-status.enum';
import { randomUUID } from 'crypto';
import { FilterTasksByParametersDto } from './dto/filter-tasks-by-parameters.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    it('should return all tasks with filter applied', async () => {
      const userId = 'id';
      const taskDto = createTaskDto();
      const tasks: TaskEntity[] = [
        newTask(taskDto, userId, randomUUID()),
        newTask(taskDto, userId, randomUUID()),
      ];
      const params: FilterTasksByParametersDto = {
        limit: 10,
        offset: 0,
        status: TaskStatusEnum.TO_DO,
        title: 'title',
      };
      const searshParams: FindOptionsWhere<TaskEntity> = {
        userId: userId,
        title: ILike(`%${params.title}%`),
        status: ILike(`%${params.status}%`),
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

    it('should return all tasks without the filter', async () => {
      const userId = 'id';
      const taskDto = createTaskDto();
      const tasks: TaskEntity[] = [
        newTask(taskDto, userId, randomUUID()),
        newTask(taskDto, userId, randomUUID()),
      ];
      const params: FilterTasksByParametersDto = {};
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

  describe('findById', () => {
    it('must return a task from the user informed by id', async () => {
      const userId = randomUUID();
      const taskDto = createTaskDto();
      const taskEntity = newTask(taskDto, userId);

      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(taskEntity);

      const response = await taksService.findById(userId, taskEntity.id);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskEntity.id,
          userId: userId,
        },
      });

      expect(response).toEqual({
        id: taskEntity.id,
        title: taskEntity.title,
        description: taskEntity.description,
        expirationDate: taskEntity.expirationDate,
        status: TaskStatusEnum[taskEntity.status],
        userId: taskEntity.userId,
      });
    });

    it('should return a task not found exception', async () => {
      const userId = randomUUID();
      const taskId = randomUUID();

      expect(
        async () => await taksService.findById(userId, taskId),
      ).rejects.toThrow(
        new HttpException(
          `Task with id ${taskId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    it('must update a task from the user informed by id', async () => {
      const userId = randomUUID();
      const taskId = randomUUID();
      const taskDto = createTaskDto();
      const taskEntity = newTask(taskDto, userId, taskId);

      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(taskEntity);

      const response = await taksService.update(userId, taskEntity.id, {});

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId,
        },
      });
      expect(tasksRepository.update).toHaveBeenCalledWith(taskId, {});
      expect(response).toBeUndefined();
    });

    it('should return a task not found exception', async () => {
      const userId = randomUUID();
      const taskId = randomUUID();

      expect(async () =>
        taksService.update(userId, taskId, {}),
      ).rejects.toThrow(
        new HttpException(
          `Task with id ${taskId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('delete', () => {
    it('must delete a task from the user informed by id', async () => {
      const userId = randomUUID();
      const id = randomUUID();
      const taskDto = createTaskDto();
      const taskEntity = newTask(taskDto, userId, id);

      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(taskEntity);

      const response = await taksService.delete(userId, id);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(tasksRepository.delete).toHaveBeenCalledWith({ id, userId });
      expect(response).toBeUndefined();
    });
    it('should return a task not found exception', async () => {
      const userId = randomUUID();
      const id = randomUUID();

      expect(async () => await taksService.delete(userId, id)).rejects.toThrow(
        new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND),
      );
    });
  });
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

const newTask = (
  data: CreateTaskDto,
  userId: string,
  id?: string,
): TaskEntity => {
  const newTask: TaskEntity = {
    id: id || randomUUID(),
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
