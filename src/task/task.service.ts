import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDTO, TaskStatusEnum } from './dto/task.DTO';
import { TaskEntity } from '../db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) { }

  async create(task: TaskDTO): Promise<TaskDTO> {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: TaskStatusEnum.TO_DO
    }

    const createdTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDto(createdTask);
  }

  async findById(id: string): Promise<TaskDTO> {
    const foundTask = await this.taskRepository.findOne({ where: { id } })

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(foundTask);
  }

  async findAll(params: FindAllParameters): Promise<TaskDTO[]> {
    const searchPrams: FindOptionsWhere<TaskEntity> = {}

    if (params.title) {
      searchPrams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchPrams.status = Like(`%${params.status}%`);
    }

    const tasksFound = await this.taskRepository.find({
      where: searchPrams
    });


    return tasksFound.map(taskEntity => this.mapEntityToDto(taskEntity));
  }

  async update(id: string, task: TaskDTO) {
    const foundTask = await this.taskRepository.findOne({ where: { id } })

    if (!foundTask) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.taskRepository.update(id, this.mapDtoToEntity(task));
  }

  async remove(id: string) {

    const result = await this.taskRepository.delete(id)

    if (!result.affected) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(taskEntity: TaskEntity): TaskDTO {
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      expirationDate: taskEntity.expirationDate,
      status: TaskStatusEnum[taskEntity.status]
    }
  }

  private mapDtoToEntity(taskDTO: TaskDTO): Partial<TaskEntity> {
    return {
      title: taskDTO.title,
      description: taskDTO.description,
      expirationDate: taskDTO.expirationDate,
      status: taskDTO.status.toString()
    }
  }
}