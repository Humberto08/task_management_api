import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindAllParameters, TaskDTO, TaskRouteParameters } from './dto/task.DTO';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  async create(@Body() task: TaskDTO): Promise<TaskDTO> {
    return await this.taskService.create(task);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<TaskDTO[]> {
    return await this.taskService.findAll(params);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouteParameters, @Body() task: TaskDTO) {
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  remove(@Param() params: TaskRouteParameters,) {
    return this.taskService.remove(params.id);
  }
}