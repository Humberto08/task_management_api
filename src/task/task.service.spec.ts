import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../db/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskDTO, TaskStatusEnum } from './dto/task.DTO';
import { HttpException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<TaskEntity>;

  const mockTaskRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskDTO: TaskDTO = {
        id: '1',
        title: 'Test Task',
        description: 'Task Description',
        expirationDate: new Date(),
        status: TaskStatusEnum.TO_DO,
      };

      const taskEntity: TaskEntity = {
        ...taskDTO,
      };

      mockTaskRepository.save.mockResolvedValue(taskEntity);

      const result = await service.create(taskDTO);
      expect(result).toEqual(taskDTO);
      expect(mockTaskRepository.save).toHaveBeenCalledWith({
        title: taskDTO.title,
        description: taskDTO.description,
        expirationDate: taskDTO.expirationDate,
        status: TaskStatusEnum.TO_DO,
      });
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const taskEntity: TaskEntity = {
        id: '1',
        title: 'Test Task',
        description: 'Task Description',
        expirationDate: new Date(),
        status: TaskStatusEnum.TO_DO,
      };

      mockTaskRepository.findOne.mockResolvedValue(taskEntity);

      const result = await service.findById('1');
      expect(result).toEqual(taskEntity);
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an exception if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskDTO: TaskDTO = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        expirationDate: new Date(),
        status: TaskStatusEnum.IN_PROGRESS,
      };

      const taskEntity: TaskEntity = {
        ...taskDTO,
      };

      mockTaskRepository.findOne.mockResolvedValue(taskEntity);
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });

      await service.update('1', taskDTO);

      expect(mockTaskRepository.update).toHaveBeenCalledWith('1', {
        title: taskDTO.title,
        description: taskDTO.description,
        expirationDate: taskDTO.expirationDate,
        status: TaskStatusEnum.IN_PROGRESS.toString(),
      });
    });

    it('should throw an exception if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', {} as TaskDTO)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockTaskRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an exception if task not found', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(HttpException);
    });
  });
});
