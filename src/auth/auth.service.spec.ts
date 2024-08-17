import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthResponseDTO } from './dto/auth.DTO';

// Mock bcrypt functions
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByUserName: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(3600), // Mock JWT_EXPIRATION_TIME
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and expiration time if user is valid', async () => {
      const userDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };
      const payload = { sub: userDTO.id, username: userDTO.username };
      const token = 'some-jwt-token';

      mockUsersService.findByUserName.mockResolvedValue(userDTO);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.signIn(userDTO.username, 'password123');
      expect(result).toEqual({ token, expiresIn: 3600 });
      expect(mockUsersService.findByUserName).toHaveBeenCalledWith(userDTO.username);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should throw UnauthorizedException if user is invalid', async () => {
      mockUsersService.findByUserName.mockResolvedValue(null);

      await expect(service.signIn('invaliduser', 'password123'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const userDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };

      mockUsersService.findByUserName.mockResolvedValue(userDTO);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(service.signIn(userDTO.username, 'wrongpassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should throw an error if method is not implemented', async () => {
      // Use an arrow function to handle the async rejection
      await expect(async () => {
        await service.validateUser('username', 'password');
      }).rejects.toThrow('Method not implemented.');
    });
  });
});
