import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('testSecret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true and set request.user if the token is valid', async () => {
      const token = 'validToken';
      const payload = { sub: 'userId', username: 'username' };
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as any;

      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(request['user']).toEqual(payload);
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      const request = {
        headers: {},
      } as any;

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      await expect(guard.canActivate(context))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalidToken';
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as any;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      await expect(guard.canActivate(context))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
