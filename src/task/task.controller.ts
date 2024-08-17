import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDTO } from './dto/task.DTO';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() task: TaskDTO) {
    await this.taskService.create(task);
  }

  @Get('/:id')
  findById(@Param('id') id: string): TaskDTO {
    return this.taskService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): TaskDTO[] {
    return this.taskService.findAll(params);
  }

  @Put('/:id')
  update(@Body() task: TaskDTO) {
    this.taskService.update(task);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
}

}


