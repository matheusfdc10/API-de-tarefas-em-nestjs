import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    controller = new UsersController(usersServiceMock as any);
  });

  it('create', async () => {
    const user: CreateUserDto = createUserDto();

    const result = await controller.create(user);

    expect(usersServiceMock.create).toHaveBeenCalledWith(user);
    expect(result).toBeUndefined();
  });
});

const createUserDto = (data?: Partial<CreateUserDto>): CreateUserDto => {
  const createUserDto: CreateUserDto = {
    userName: data?.userName || 'johndoe123',
    password: data?.password || '12345678',
  };

  return createUserDto;
};
