import { Injectable, NotImplementedException } from '@nestjs/common';
import { TaskDTO } from './dto/task.DTO';

@Injectable()
export class TaskService {

  private tasks: TaskDTO[] = [];

  create(task: TaskDTO) {
    this.tasks.push(task);
    console.log(this.tasks);
  }

  findById(id: string): TaskDTO {
    const foundTask = this.tasks.filter(task => task.id === id);

    if (foundTask.length) {
      return foundTask[0];
    }

    throw new NotImplementedException('Task with id ${id} not found');
  }
}

