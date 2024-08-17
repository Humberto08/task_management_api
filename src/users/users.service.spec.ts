import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.DTO';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  const mockUsersRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDTO: UserDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };

      const userEntity: UserEntity = {
        ...userDTO,
        passwordHash: bcrypt.hashSync(userDTO.password, 10),
      };

      mockUsersRepository.findOne.mockResolvedValue(null); // No existing user
      mockUsersRepository.save.mockResolvedValue(userEntity);

      const result = await service.create({
        username: userDTO.username,
        password: userDTO.password,
        id: '',
      });

      expect(result).toEqual({ id: '1', username: 'testuser' });
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        username: userDTO.username,
        passwordHash: expect.any(String),
      });
    });

    it('should throw a ConflictException if user already registered', async () => {
      const userDTO: UserDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };

      mockUsersRepository.findOne.mockResolvedValue({ username: 'testuser' });

      await expect(service.create({
        username: userDTO.username,
        password: userDTO.password,
        id: '',
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('findByUserName', () => {
    it('should find a user by username', async () => {
      const userDTO: UserDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };

      const userEntity = {
        id: '1',
        username: 'testuser',
        passwordHash: bcrypt.hashSync('password123', 10),
      };

      mockUsersRepository.findOne.mockResolvedValue(userEntity);

      const result = await service.findByUserName('testuser');

      // Compare apenas os campos relevantes, excluindo a senha
      expect(result).toMatchObject({
        id: userEntity.id,
        username: userEntity.username,
      });
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUserName('nonexistentuser');
      expect(result).toBeNull();
    });
  });
});
