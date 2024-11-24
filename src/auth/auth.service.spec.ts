import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashingService } from 'src/common/hashing/hashing.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { UserEntity } from 'src/db/entities/user.entity';
import { randomUUID } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let jwtExpirationTimeInSeconds: number;
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (propertyPath: string): number =>
              propertyPath ? 3600 : undefined,
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByUserName: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    hashingService = module.get<HashingService>(HashingService);
    jwtExpirationTimeInSeconds = configService.get('JWT_EXPIRATION_TIME');
  });

  it('must be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('must return an object with accessToken and expiresIn', async () => {
      const signIn: SignInDto = {
        userName: 'jhondoe1234',
        password: '12345678',
      };
      const passwordHash = 'passwordHash';
      const user = createUser(signIn, passwordHash);
      const passwordIsValid = true;
      const payload = { userName: user.userName, sub: user.id };
      const token = 'token';

      jest.spyOn(userService, 'findByUserName').mockResolvedValue(user);
      jest.spyOn(hashingService, 'compare').mockResolvedValue(passwordIsValid);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const response = await authService.signIn(signIn);

      expect(userService.findByUserName).toHaveBeenCalledWith(signIn.userName);
      expect(hashingService.compare).toHaveBeenCalledWith(
        signIn.password,
        user.passwordHash,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(response).toEqual({
        accessToken: token,
        expiresIn: jwtExpirationTimeInSeconds,
      });
    });

    it('should return a PROHIBITED exception if the password is not valid', async () => {
      const signIn: SignInDto = {
        userName: 'jhondoe1234',
        password: '12345678',
      };
      const passwordHash = 'passwordHash';
      const user = createUser(signIn, passwordHash);
      const passwordIsValid = false;

      jest.spyOn(userService, 'findByUserName').mockResolvedValue(user);
      jest.spyOn(hashingService, 'compare').mockResolvedValue(passwordIsValid);

      expect(async () => await authService.signIn(signIn)).rejects.toThrow(
        new HttpException('UserName or Password invalid', HttpStatus.FORBIDDEN),
      );
    });

    it('should return a PROHIBITED exception if the user does not exist', async () => {
      const signIn: SignInDto = {
        userName: 'jhondoe1234',
        password: '12345678',
      };
      const user = null;
      const passwordIsValid = true;

      jest.spyOn(userService, 'findByUserName').mockResolvedValue(user);
      jest.spyOn(hashingService, 'compare').mockResolvedValue(passwordIsValid);

      expect(async () => await authService.signIn(signIn)).rejects.toThrow(
        new HttpException('UserName or Password invalid', HttpStatus.FORBIDDEN),
      );
    });
  });
});

const createUser = (data: SignInDto, passwordHash: string): UserEntity => {
  const user: UserEntity = {
    id: randomUUID(),
    userName: data.userName,
    passwordHash: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return user;
};
