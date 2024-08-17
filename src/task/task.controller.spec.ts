import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { FindAllParameters, TaskDTO, TaskStatusEnum } from './dto/task.DTO';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const task: TaskDTO = {
        id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        expirationDate: new Date(),
        status: TaskStatusEnum.TO_DO,
      };

      jest.spyOn(service, 'create').mockResolvedValue(task);

      expect(await controller.create(task)).toBe(task);
      expect(service.create).toHaveBeenCalledWith(task);
    });
  });

  describe('findById', () => {
    it('should return a task by ID', async () => {
      const task: TaskDTO = {
        id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        expirationDate: new Date(),
        status: TaskStatusEnum.TO_DO,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(task);

      expect(await controller.findById('1')).toBe(task);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const task: TaskDTO = {
        id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        expirationDate: new Date(),
        status: TaskStatusEnum.TO_DO,
      };
  
      const params: FindAllParameters = {
        title: '',
        status: TaskStatusEnum.TO_DO,
      };
  
      jest.spyOn(service, 'findAll').mockResolvedValue([task]);
  
      expect(await controller.findAll(params)).toEqual([task]);
      expect(service.findAll).toHaveBeenCalledWith(params);
    });
  });
  

  describe('update', () => {
    it('should update a task', async () => {
      const task: TaskDTO = {
        id: '1',
        title: 'Updated Task',
        description: 'This is an updated task',
        expirationDate: new Date(),
        status: TaskStatusEnum.IN_PROGRESS,
      };

      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      await controller.update({ id: '1' }, task);
      expect(service.update).toHaveBeenCalledWith('1', task);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ id: '1' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
