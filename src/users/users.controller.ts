import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserDocument } from './decorators/documentation/create-user.document';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CreateUserDocument()
  async create(@Body() user: CreateUserDto) {
    await this.usersService.create(user);
  }

  // @Get()
  // async findAll(): Promise<UserEntity[]> {
  //   return this.usersService.findAll();
  // }
}
