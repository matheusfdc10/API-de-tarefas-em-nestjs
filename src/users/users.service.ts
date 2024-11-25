import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashingService: HashingService,
  ) {}

  async create(newUser: CreateUserDto) {
    const userAlreadyRegistered = await this.usersRepository.findOne({
      where: { userName: newUser.userName },
    });

    if (userAlreadyRegistered) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const passwordHash = await this.hashingService.hash(newUser.password);

    const dbUser = new UserEntity();
    dbUser.userName = newUser.userName;
    dbUser.passwordHash = passwordHash;

    await this.usersRepository.save(dbUser);
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const userFound = await this.usersRepository.findOne({
      where: { userName },
    });

    if (!userFound) {
      return null;
    }

    return userFound;
  }

  // async findAll(): Promise<UserEntity[]> {
  //   const users = await this.usersRepository.find();

  //   return users;
  // }
}
