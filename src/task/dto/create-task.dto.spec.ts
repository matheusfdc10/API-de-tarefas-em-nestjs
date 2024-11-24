import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { plainToInstance } from 'class-transformer';

describe('CreateTaskDto', () => {
  let dto: CreateTaskDto;
  const date = new Date();

  beforeEach(() => {
    dto = new CreateTaskDto();
    dto.title = 'study nestjs';
    dto.description = 'study nestjs';
    dto.expirationDate = date;
  });

  it('should be valid', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title', () => {
    it('should fail if title is not string', async () => {
      dto.title = 111 as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints.isString).toBe('title must be a string');
    });

    it('should fail if title is less than 3 characters', async () => {
      dto.title = 'ab';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints.minLength).toBe(
        'title must be longer than or equal to 3 characters',
      );
    });

    it('should fail if title is longer than 256 characters', async () => {
      dto.title = 'a'.repeat(257);
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints.maxLength).toBe(
        'title must be shorter than or equal to 256 characters',
      );
    });

    it('should fail if title is empty', async () => {
      dto.title = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints.isNotEmpty).toBe(
        'title should not be empty',
      );
    });
  });

  describe('description', () => {
    it('should fail if description is not string', async () => {
      dto.description = 111 as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints.isString).toBe(
        'description must be a string',
      );
    });

    it('should fail if description is less than 5 characters', async () => {
      dto.description = 'ab';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints.minLength).toBe(
        'description must be longer than or equal to 5 characters',
      );
    });

    it('should fail if description is longer than 512 characters', async () => {
      dto.description = 'a'.repeat(513);
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints.maxLength).toBe(
        'description must be shorter than or equal to 512 characters',
      );
    });

    it('should fail if description is empty', async () => {
      dto.description = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints.isNotEmpty).toBe(
        'description should not be empty',
      );
    });
  });

  describe('status', () => {
    it(`should fail if status is not enum (${TaskStatusEnum.TO_DO}, ${TaskStatusEnum.IN_PROGRESS}, ${TaskStatusEnum.DONE})`, async () => {
      dto.status = 1 as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints.isEnum).toBe(
        'status must be one of the following values: TO_DO, IN_PROGRESS, DONE',
      );
    });

    it(`must pass if status is undefined`, async () => {
      dto.status = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('expirationDate', () => {
    it('should fail if expirationDate is not a date', async () => {
      dto.expirationDate = 'invalid-date' as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('expirationDate');
      expect(errors[0].constraints.isDate).toBe(
        'expirationDate must be a Date instance',
      );
    });

    it('should fail if expirationDate is empty', async () => {
      dto.expirationDate = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('expirationDate');
      expect(errors[0].constraints.isNotEmpty).toBe(
        'expirationDate should not be empty',
      );
    });

    it('should transform expirationDate to an instance of Date', async () => {
      const payload = { expirationDate: '2024-11-25T12:00:00Z' };
      const dtoTest = plainToInstance(CreateTaskDto, payload);
      expect(dtoTest.expirationDate).toBeInstanceOf(Date); // Verifica transformação para Date
      expect(dtoTest.expirationDate.toISOString()).toBe(
        '2024-11-25T12:00:00.000Z',
      ); // Verifica valor exato
    });
  });
});
