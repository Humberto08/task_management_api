import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
  }

  update(task: TaskDTO) {
    let taskIndex = this.tasks.findIndex(t => t.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;

      return;
  }

  throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.NOT_FOUND);
}

}
