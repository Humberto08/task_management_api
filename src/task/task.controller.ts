import { Body, Controller, Post } from '@nestjs/common';
import { TaskDTO } from './dto/task.DTO';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskDTO) {
    this.taskService.create(task);
    this.taskService.create(task);
  }
}
