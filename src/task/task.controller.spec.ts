import { randomUUID } from 'crypto';
import { TaskController } from './task.controller';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthRequestDto } from 'src/auth/dto/auth-request.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/constants';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskStatusEnum } from './enum/task-status.enum';
import { FilterTasksByParametersDto } from './dto/filter-tasks-by-parameters.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  const tasksServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    controller = new TaskController(tasksServiceMock as any);
  });

  it('create', async () => {
    const userId = randomUUID();
    const task: CreateTaskDto = createTaskDto();

    const result = await controller.create(
      { [REQUEST_TOKEN_PAYLOAD_KEY]: { sub: userId } } as AuthRequestDto,
      task,
    );

    expect(tasksServiceMock.create).toHaveBeenCalledWith(userId, task);
    expect(result).toBeUndefined();
  });

  it('findAll', async () => {
    const userId = randomUUID();
    const tasks: ResponseTaskDto[] = [
      createTaskEntity(createTaskDto(), userId),
      createTaskEntity(createTaskDto(), userId),
    ].map(
      (task) =>
        ({
          id: task.id,
          title: task.title,
          description: task.description,
          expirationDate: task.expirationDate,
          status: task.status,
          userId: task.userId,
        }) as ResponseTaskDto,
    );
    const request = {
      [REQUEST_TOKEN_PAYLOAD_KEY]: { sub: userId },
    } as AuthRequestDto;
    const params = {
      limit: +'10',
      offset: +'0',
      status: TaskStatusEnum.TO_DO,
      title: 'title',
    } as FilterTasksByParametersDto;

    jest.spyOn(tasksServiceMock, 'findAll').mockResolvedValue(tasks);

    const result = await controller.findAll(request, params);

    expect(tasksServiceMock.findAll).toHaveBeenCalledWith(
      request.tokenPayload.sub,
      params,
    );
    expect(result).toEqual(tasks);
  });

  it('findById', async () => {
    const userId = randomUUID();
    const taskId = randomUUID();
    const task = createTaskEntity(createTaskDto(), userId, taskId);
    const responseTaskDto: ResponseTaskDto = {
      id: task.id,
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: TaskStatusEnum[task.status],
      userId: task.userId,
    };
    const request = {
      [REQUEST_TOKEN_PAYLOAD_KEY]: { sub: userId },
    } as AuthRequestDto;

    jest.spyOn(tasksServiceMock, 'findById').mockResolvedValue(responseTaskDto);

    const result = await controller.findById(request, taskId);

    expect(tasksServiceMock.findById).toHaveBeenCalledWith(
      request.tokenPayload.sub,
      taskId,
    );
    expect(result).toEqual(responseTaskDto);
  });

  it('update', async () => {
    const userId = randomUUID();
    const taskId = randomUUID();
    const request = {
      [REQUEST_TOKEN_PAYLOAD_KEY]: { sub: userId },
    } as AuthRequestDto;
    const taskUpdate: UpdateTaskDto = {
      title: 'update',
      description: 'update',
      expirationDate: new Date(),
      status: TaskStatusEnum.IN_PROGRESS,
    };

    const response = await controller.update(request, taskId, taskUpdate);
    expect(tasksServiceMock.update).toHaveBeenCalledWith(
      request.tokenPayload.sub,
      taskId,
      taskUpdate,
    );
    expect(response).toBeUndefined();
  });

  it('delete', async () => {
    const userId = randomUUID();
    const taskId = randomUUID();
    const request = {
      [REQUEST_TOKEN_PAYLOAD_KEY]: { sub: userId },
    } as AuthRequestDto;

    const response = await controller.delete(request, taskId);
    expect(tasksServiceMock.delete).toHaveBeenCalledWith(
      request.tokenPayload.sub,
      taskId,
    );
    expect(response).toBeUndefined();
  });
});

const createTaskDto = (data?: Partial<CreateTaskDto>): CreateTaskDto => {
  const createTaskDto: CreateTaskDto = {
    title: data?.title || 'Title test',
    description: data?.description || 'Description Test',
    expirationDate: data?.expirationDate || new Date(),
    status: data?.status,
  };

  return createTaskDto;
};

const createTaskEntity = (
  data: CreateTaskDto,
  userId: string,
  id?: string,
): TaskEntity => {
  const taskEntity: TaskEntity = {
    id: id || randomUUID(),
    title: data.title,
    description: data.title,
    expirationDate: data.expirationDate,
    status: data?.status || TaskStatusEnum.TO_DO,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return taskEntity;
};
