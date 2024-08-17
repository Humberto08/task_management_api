import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthResponseDTO } from './dto/auth.DTO';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a valid AuthResponseDTO if credentials are correct', async () => {
      const authResponse: AuthResponseDTO = {
        token: 'some-jwt-token',
        expiresIn: 3600,
      };
      const username = 'testuser';
      const password = 'password123';

      mockAuthService.signIn.mockResolvedValue(authResponse);

      const result = await controller.signIn(username, password);
      expect(result).toEqual(authResponse);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(username, password);
    });

    it('should throw UnauthorizedException if signIn fails', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn(username, password))
        .rejects
        .toThrow(UnauthorizedException);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(username, password);
    });
  });
});
