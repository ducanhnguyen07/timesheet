import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { ResponseTaskDto } from './dto/response/response-task-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DeepPartial, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { ResponseUserDto } from '../../src/user/dto/response/response-user-dto';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  async create(
    createTaskDto: CreateTaskDto,
  ): Promise<ResponseTaskDto | string> {
    try {
      const newTask = await this.taskRepository.save({
        ...createTaskDto,
        projectId: createTaskDto.projectId as DeepPartial<Project>,
        userId: createTaskDto.userId as DeepPartial<User>,
      });

      const responseTask = plainToInstance(ResponseTaskDto, newTask, {
        excludeExtraneousValues: true,
      });
      return responseTask;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findAll() {
    try {
      const responseTaskList = [];

      const taskList = await this.taskRepository.find({
        relations: ['projectId', 'userId'],
      });

      for (const task of taskList) {
        const objTask = {};
        const responseUser = plainToInstance(ResponseUserDto, task.userId, {
          excludeExtraneousValues: true
        });

        objTask['id'] = task.id;
        objTask['name'] = task.name;
        objTask['description'] = task.description;
        objTask['requirement'] = task.requirement;
        objTask['status'] = task.status;
        objTask['user'] = responseUser;
        objTask['project'] = task.projectId;
        
        responseTaskList.push(objTask);
      }

      return responseTaskList;
    } catch (error) {
      console.log(error);
    }
  }

  async getOwnTask(user: any) {
    try {
      const taskList = await this.taskRepository.find({
        relations: ['userId', 'projectId']
      });

      const filteredTaskList = taskList.filter(task => task.userId.id === user.id);

      const responseTaskList = [];
      for (const task of filteredTaskList) {
        const objTask = {};
        const responseUser = plainToInstance(ResponseUserDto, task.userId, {
          excludeExtraneousValues: true
        });

        objTask['id'] = task.id;
        objTask['name'] = task.name;
        objTask['description'] = task.description;
        objTask['requirement'] = task.requirement;
        objTask['status'] = task.status;
        objTask['user'] = responseUser;
        objTask['project'] = task.projectId;
        
        responseTaskList.push(objTask);
      }

      return responseTaskList;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<ResponseTaskDto | string> {
    try {
      const task = await this.taskRepository.findOne({
        where: {
          id: id,
        },
      });

      const responseTask = plainToInstance(ResponseTaskDto, task, {
        excludeExtraneousValues: true,
      });

      return responseTask;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseTaskDto | string> {
    try {
      const updateTask = await this.taskRepository.findOne({
        where: { id: id },
      });

      Object.assign(updateTask, updateTaskDto);
      const updatedTask = await this.taskRepository.save(updateTask);

      const responseTask = plainToInstance(ResponseTaskDto, updatedTask, {
        excludeExtraneousValues: true,
      });

      return responseTask;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async remove(id: string): Promise<ResponseTaskDto | string> {
    try {
      const deleteTask = await this.taskRepository.findOne({
        where: { id: id },
      });

      deleteTask.isDeleted = true;
      deleteTask.deletedAt = new Date();

      const deletedTask = await this.taskRepository.save(deleteTask);
      const responseTask = plainToInstance(ResponseTaskDto, deletedTask, {
        excludeExtraneousValues: true,
      });

      return responseTask;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
