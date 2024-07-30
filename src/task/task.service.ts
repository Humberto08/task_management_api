import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDTO } from './dto/task.DTO';

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

  findAll(params: FindAllParameters): TaskDTO[] {
    return this.tasks.filter(task => {
      let match = true;

      if (params.title != undefined && !task.title.includes(params.title)) {
        match = false
      }

      if (params.status != undefined && !task.status.includes(params.status)) {
        match = false
      }
      return match;   
      }
    );

  }

  update(task: TaskDTO) {
    let taskIndex = this.tasks.findIndex(t => t.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;

      return;
  }

  throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.BAD_REQUEST);
}

  remove(id: string) {
    let taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
  }

  throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);

}


}
