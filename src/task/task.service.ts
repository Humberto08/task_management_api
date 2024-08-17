import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDTO, TaskStatusEnum } from './dto/task.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  private tasks: TaskDTO[] = [];

  async create(task: TaskDTO) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: TaskStatusEnum.TO_DO,
    };

    const createdTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDTO(createdTask);
  }

  findById(id: string): TaskDTO {
    const foundTask = this.tasks.filter((task) => task.id === id);

    if (foundTask.length) {
      return foundTask[0];
    }

    throw new HttpException(
      `Task with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  findAll(params: FindAllParameters): TaskDTO[] {
    return this.tasks.filter((task) => {
      let match = true;

      if (params.title != undefined && !task.title.includes(params.title)) {
        match = false;
      }

      if (params.status != undefined && !task.status.includes(params.status)) {
        match = false;
      }
      return match;
    });
  }

  update(task: TaskDTO) {
    let taskIndex = this.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;

      return;
    }

    throw new HttpException(
      `Task with id ${task.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    let taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    throw new HttpException(
      `Task with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  private mapEntityToDTO(taskEntity: TaskEntity): TaskDTO {
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      expirationDate: taskEntity.expirationDate,
      status: TaskStatusEnum[taskEntity.status]
    }
  }
}
