import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<UserEntity>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('must be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUser = createUserDto();
      const passwordHash = hashPassword();

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      await usersService.create(createUser);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userName: createUser.userName },
      });
      expect(hashingService.hash).toHaveBeenCalledWith(createUser.password);
      expect(usersRepository.save).toHaveBeenCalledWith({
        userName: createUser.userName,
        passwordHash: passwordHash,
      } as UserEntity);
    });

    it('should throw an error if the username already exists', async () => {
      const createUser = createUserDto();
      const passwordHash = hashPassword();
      const existingUser = newUser(createUser, passwordHash);

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(existingUser);

      expect(async () => usersService.create(createUser)).rejects.toThrow(
        new HttpException('Username already exists', HttpStatus.CONFLICT),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userName: createUser.userName },
      });
      expect(hashingService.hash).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByUserName', () => {
    it('should return a user by username', async () => {
      const user = createUserDto();
      const userName = user.userName;
      const passwordHash = hashPassword();
      const userFound = newUser(user, passwordHash);

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(userFound);

      const response = await usersService.findByUserName(user.userName);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(response).toEqual(userFound);
    });

    it('should return null if there is no user', async () => {
      const user = createUserDto();
      const userName = user.userName;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const response = await usersService.findByUserName(user.userName);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(response).toEqual(null);
    });
  });
});

const createUserDto = (data?: Partial<CreateUserDto>): CreateUserDto => {
  const createUserDto: CreateUserDto = {
    userName: data?.userName || 'johndoe123',
    password: data?.password || '12345678',
  };

  return createUserDto;
};

const newUser = (data: CreateUserDto, passwordHash: string): UserEntity => {
  const newUser: UserEntity = {
    id: randomUUID(),
    userName: data.userName,
    passwordHash: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return newUser;
};

const hashPassword = () => randomUUID();
