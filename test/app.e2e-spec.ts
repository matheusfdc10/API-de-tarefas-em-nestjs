import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/app/config/app.config';
import documentConfig from 'src/app/config/document.config';
import { AuthModule } from 'src/auth/auth.module';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { DbModule } from 'src/db/db.module';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskStatusEnum } from 'src/task/enum/task-status.enum';
import { TaskModule } from 'src/task/task.module';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';

// configure typeOrm with "dropSchema: true" before running the test

describe('AppConrtoller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TaskModule,
        UsersModule,
        AuthModule,
        DbModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);
    documentConfig(app);

    await app.init();
  }, 10000);

  afterEach(async () => {
    await app.close();
  });

  describe('/users', () => {
    describe('/ (POST)', () => {
      it('should be able to create a new user', async () => {
        const response = await createUser(app, HttpStatus.CREATED);

        expect(response.body).toEqual({});
      });

      it('should generate an username already exists error', async () => {
        await createUser(app, HttpStatus.CREATED);
        const response = await createUser(app, HttpStatus.CONFLICT);
        expect(response.body.message).toBe('Username already exists');
      });

      it('should generate a short password error', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          password: '1234567',
        });

        expect(response.body.message).toEqual([
          'password must be longer than or equal to 8 characters',
        ]);
        expect(response.body.message).toContain(
          'password must be longer than or equal to 8 characters',
        );
      });

      it('should generate a long password error', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          password: '1'.repeat(257),
        });

        expect(response.body.message).toEqual([
          'password must be shorter than or equal to 256 characters',
        ]);
      });

      it('should generate an undefined password error', async () => {
        const createUserDto = new CreateUserDto();
        createUserDto.userName = 'jhondoe123';

        const response = await request(app.getHttpServer())
          .post('/users')
          .send(createUserDto)
          .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain('password should not be empty');
      });

      it('should generate a password error with spaces', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          password: 'jon 12345',
        });
        expect(response.body.message).toEqual([
          'password cannot contain spaces',
        ]);
      });

      it('should throw an error if the password is not a string', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          password: 123456 as any,
        });
        expect(response.body.message).toContain('password must be a string');
      });

      it('should generate a short userName error', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          userName: '12',
        });

        expect(response.body.message).toEqual([
          'userName must be longer than or equal to 3 characters',
        ]);
        expect(response.body.message).toContain(
          'userName must be longer than or equal to 3 characters',
        );
      });

      it('should generate a long userName error', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          userName: '1'.repeat(25),
        });

        expect(response.body.message).toEqual([
          'userName must be shorter than or equal to 24 characters',
        ]);
      });

      it('should generate an undefined userName error', async () => {
        const createUserDto = new CreateUserDto();
        createUserDto.password = 'jhondoe123';

        const response = await request(app.getHttpServer())
          .post('/users')
          .send(createUserDto)
          .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain('userName should not be empty');
      });

      it('should generate a userName error with spaces', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          userName: 'jon 12345',
        });
        expect(response.body.message).toEqual([
          'userName cannot contain spaces',
        ]);
      });

      it('should throw an error if the userName is not a string', async () => {
        const response = await createUser(app, HttpStatus.BAD_REQUEST, {
          userName: 123456 as any,
        });
        expect(response.body.message).toContain('userName must be a string');
      });
    });
  });

  describe('/auth', () => {
    describe('POST /login', () => {
      it('should return a 403 status code if the user is not found', async () => {
        const response = await login(app, HttpStatus.FORBIDDEN, {
          userName,
          password,
        });
        expect(response.body.message).toEqual('UserName or Password invalid');
      });
      it('should return a 403 status code if the userName is invalid', async () => {
        await createUser(app, HttpStatus.CREATED);
        const response = await login(app, HttpStatus.FORBIDDEN, {
          userName: 'invalid',
        });
        expect(response.body.message).toEqual('UserName or Password invalid');
      });
      it('should throw an error if the userName is not a string', async () => {
        const response = await login(app, HttpStatus.BAD_REQUEST, {
          userName: 123456 as any,
        });
        expect(response.body.message).toContain('userName must be a string');
      });
      it('should generate a userName error with spaces', async () => {
        const response = await login(app, HttpStatus.BAD_REQUEST, {
          userName: 'jhon 12345',
        });
        expect(response.body.message).toEqual([
          'userName cannot contain spaces',
        ]);
      });
      it('should generate an undefined userName error', async () => {
        const signInDto = new SignInDto();
        signInDto.password = password;

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(signInDto)
          .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain('userName should not be empty');
      });
      it('should return a 403 status code if the password is invalid', async () => {
        await createUser(app, HttpStatus.CREATED);
        const response = await login(app, HttpStatus.FORBIDDEN, {
          password: 'invalid',
        });
        expect(response.body.message).toEqual('UserName or Password invalid');
      });
      it('should throw an error if the password is not a string', async () => {
        const response = await login(app, HttpStatus.BAD_REQUEST, {
          password: 123456 as any,
        });
        expect(response.body.message).toContain('password must be a string');
      });
      it('should generate a password error with spaces', async () => {
        const response = await login(app, HttpStatus.BAD_REQUEST, {
          password: 'jhon 12345',
        });
        expect(response.body.message).toEqual([
          'password cannot contain spaces',
        ]);
      });
      it('should generate an undefined password error', async () => {
        const signInDto = new SignInDto();
        signInDto.userName = userName;

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(signInDto)
          .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain('password should not be empty');
      });
      it('must return the accessToken and expiresIn', async () => {
        await createUser(app, HttpStatus.CREATED);
        const response = await login(app, HttpStatus.OK);
        expect(response.body).toEqual({
          accessToken: expect.any(String),
          expiresIn: expect.any(Number),
        });
      });
    });
  });

  describe('/tesks', () => {
    describe('/ (POST)', () => {
      it('should create a task and return status 201', async () => {
        await createUser(app, HttpStatus.CREATED);
        const loginUser = await login(app, HttpStatus.OK);
        const response = await createTask(
          app,
          HttpStatus.CREATED,
          loginUser.body.accessToken,
        );

        expect(response.body).toEqual({});
      });
      it('must return unauthorized if do not send Authorization', async () => {
        const createTaskDto = new CreateTaskDto();
        createTaskDto.title = 'task test';
        createTaskDto.description = 'task description';
        createTaskDto.expirationDate = new Date();
        createTaskDto.status = TaskStatusEnum.TO_DO;

        const response = await request(app.getHttpServer())
          .post('/tasks')
          .send(createTaskDto)
          .expect(HttpStatus.UNAUTHORIZED);
        expect(response.body.message).toEqual('Unauthorized');
      });
      it('must return unauthorized if submit an invalid or expired authorization', async () => {
        const response = await createTask(
          app,
          HttpStatus.UNAUTHORIZED,
          'token-invalid',
        );
        expect(response.body.message).toEqual('Unauthorized');
      });
      // more tests...
    });
  });
});

const userName = 'jhondoe123';
const password = '12345678';

const createUser = async (
  app: INestApplication,
  httpStatus: HttpStatus,
  newUser?: Partial<CreateUserDto>,
) => {
  const createUserDto = new CreateUserDto();
  createUserDto.userName = newUser?.userName || userName;
  createUserDto.password = newUser?.password || password;

  return await request(app.getHttpServer())
    .post('/users')
    .send(createUserDto)
    .expect(httpStatus);
};

const login = async (
  app: INestApplication,
  httpStatus: HttpStatus,
  signIn?: Partial<SignInDto>,
) => {
  const signInDto = new SignInDto();
  signInDto.userName = signIn?.userName || userName;
  signInDto.password = signIn?.password || password;

  return await request(app.getHttpServer())
    .post('/auth/login')
    .send(signInDto)
    .expect(httpStatus);
};

const createTask = async (
  app: INestApplication,
  httpStatus: HttpStatus,
  accessToken: string,
  task?: Partial<CreateTaskDto>,
) => {
  const createTaskDto = new CreateTaskDto();
  createTaskDto.title = task?.title || 'task test';
  createTaskDto.description = task?.description || 'task description';
  createTaskDto.expirationDate = task?.expirationDate || new Date();
  createTaskDto.status = TaskStatusEnum?.[task?.status] || TaskStatusEnum.TO_DO;

  return await request(app.getHttpServer())
    .post('/tasks')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(createTaskDto)
    .expect(httpStatus);
};