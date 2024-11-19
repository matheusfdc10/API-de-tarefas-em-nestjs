import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.userName = 'jhon123';
    dto.password = '12345678';
  });

  it('should be valid', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('userName', () => {
    it('should fail if username is not string', async () => {
      dto.userName = 1 as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('userName');
      expect(errors[0].constraints.isString).toBe('userName must be a string');
    });

    it('should fail if username is less than 3 characters', async () => {
      dto.userName = 'ab';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('userName');
      expect(errors[0].constraints.minLength).toBe(
        'userName must be longer than or equal to 3 characters',
      );
    });

    it('should fail if username is longer than 24 characters', async () => {
      dto.userName = 'aaaaaaaaaaaaaaaaaaaaaaaaa';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('userName');
      expect(errors[0].constraints.maxLength).toBe(
        'userName must be shorter than or equal to 24 characters',
      );
    });

    it('should fail if username is empty', async () => {
      dto.userName = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('userName');
      expect(errors[0].constraints.isNotEmpty).toBe(
        'userName should not be empty',
      );
    });

    it('should fail if username is spaces', async () => {
      dto.userName = 'jhon 123';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('userName');
      expect(errors[0].constraints.noSpaces).toBe(
        'userName cannot contain spaces',
      );
    });
  });

  describe('password', () => {
    it('should fail if password is not string', async () => {
      dto.password = 1 as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.isString).toBe('password must be a string');
    });

    it('should fail if password is less than 8 characters', async () => {
      dto.password = 'aaaaaaa';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.minLength).toBe(
        'password must be longer than or equal to 8 characters',
      );
    });

    it('should fail if password is longer than 256 characters', async () => {
      dto.password = 'a'.repeat(257);
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.maxLength).toBe(
        'password must be shorter than or equal to 256 characters',
      );
    });

    it('should fail if password is empty', async () => {
      dto.password = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.isNotEmpty).toBe(
        'password should not be empty',
      );
    });

    it('should fail if password is spaces', async () => {
      dto.password = 'jhon 123';
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.noSpaces).toBe(
        'password cannot contain spaces',
      );
    });
  });
});
