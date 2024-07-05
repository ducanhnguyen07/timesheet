import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { ResponseTaskDto } from './dto/response/response-task-dto';
import { RolesPermissionsGuard } from '../auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('v1/tasks')
@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @SetMetadata('permissions', ['task_create'])
  create(@Body() createTaskDto: CreateTaskDto): Promise<ResponseTaskDto | string> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @SetMetadata('permissions', ['task_read'])
  findAll(): Promise<ResponseTaskDto[] | string> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @SetMetadata('permissions', ['task_read'])
  findOne(@Param('id') id: string): Promise<ResponseTaskDto | string> {
    return this.taskService.findOne(id);
  }

  @Patch('update/:id')
  @SetMetadata('permissions', ['task_update'])
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<ResponseTaskDto | string> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Patch('delete/:id')
  @SetMetadata('permissions', ['task_delete'])
  remove(@Param('id') id: string): Promise<ResponseTaskDto | string> {
    return this.taskService.remove(id);
  }
}
