import { AuthController } from './auth.controller';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const authServeceMock = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    controller = new AuthController(authServeceMock as any);
  });

  it('signIn', async () => {
    const signIn: SignInDto = {
      userName: 'jhondoe123',
      password: '12345678',
    };
    const authResponse: AuthResponseDto = {
      accessToken: 'accessToken',
      expiresIn: 3600,
    };

    jest.spyOn(authServeceMock, 'signIn').mockResolvedValue(authResponse);

    const response = await controller.signIn(signIn);

    expect(authServeceMock.signIn).toHaveBeenCalledWith(signIn);
    expect(response).toEqual(authResponse);
  });
});
