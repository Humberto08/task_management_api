import { Injectable } from '@nestjs/common';
import { TaskDTO } from './dto/task.DTO';

@Injectable()
export class TaskService {

  private tasks: TaskDTO[] = [];

  create(task: TaskDTO) {
    this.tasks.push(task);
    console.log(this.tasks);
  }
}

