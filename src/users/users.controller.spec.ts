import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.DTO';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const userDTO: UserDTO = {
        id: '1',
        username: 'testuser',
        password: 'password123',
      };

      // Mock the UsersService.create method to return the userDTO
      mockUsersService.create.mockResolvedValue(userDTO);

      const result = await controller.create(userDTO);
      expect(result).toEqual(userDTO);
      expect(mockUsersService.create).toHaveBeenCalledWith(userDTO);
    });
  });
});
