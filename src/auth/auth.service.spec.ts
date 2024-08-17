import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { AuthResponseDTO } from './dto/auth.DTO';

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
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
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
    it('should return a token and expiration time when credentials are valid', async () => {
      const username = 'testUser';
      const password = 'testPass';
      const user = { id: '1', username: 'testUser', password: 'hashedPass' };
      const token = 'jwtToken';
      const expiresIn = 3600;

      mockUsersService.findByUserName.mockResolvedValue(user);
      jest.spyOn(bcryptCompareSync, 'compareSync').mockReturnValue(true);
      mockJwtService.sign.mockReturnValue(token);
      mockConfigService.get.mockReturnValue(expiresIn);

      const result: AuthResponseDTO = await service.signIn(username, password);

      expect(result).toEqual({ token, expiresIn });
      expect(mockUsersService.findByUserName).toHaveBeenCalledWith(username);
      expect(bcryptCompareSync).toHaveBeenCalledWith(password, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id, username: user.username });
    });

    it('should throw an UnauthorizedException when credentials are invalid', async () => {
      const username = 'testUser';
      const password = 'testPass';

      mockUsersService.findByUserName.mockResolvedValue(null);

      await expect(service.signIn(username, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException when password is incorrect', async () => {
      const username = 'testUser';
      const password = 'testPass';
      const user = { id: '1', username: 'testUser', password: 'hashedPass' };

      mockUsersService.findByUserName.mockResolvedValue(user);
      jest.spyOn(bcryptCompareSync, 'compareSync').mockReturnValue(false);

      await expect(service.signIn(username, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
