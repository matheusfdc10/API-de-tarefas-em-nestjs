import { AuthGuard } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../constants';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockJwtService: Partial<JwtService>;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'), // Mock do JWT_SECRET
    };

    authGuard = new AuthGuard(
      mockJwtService as JwtService,
      mockConfigService as ConfigService,
    );
  });

  it('should deny access if token is missing', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {}, // Nenhum header de autorização
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should deny access if token is invalid', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    (mockJwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('invalid-token', {
      secret: 'test-secret',
    });
  });

  it('should allow access if token is valid', async () => {
    const mockPayload = { sub: 1, username: 'testuser' };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    (mockJwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'test-secret',
    });

    const request = (mockContext.switchToHttp().getRequest()[
      REQUEST_TOKEN_PAYLOAD_KEY
    ] = mockPayload);
    expect(request).toEqual(mockPayload);
  });
});
