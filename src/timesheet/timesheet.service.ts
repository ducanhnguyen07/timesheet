import { Injectable } from '@nestjs/common';
import { CreateTimesheetDto } from './dto/request/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/request/update-timesheet.dto';
import { ResponseTimesheetDto } from './dto/response/response-timesheet-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { plainToInstance } from 'class-transformer';
import { DeleteTimesheetDto } from './dto/response/delete-timesheet-dto';
import { ResponseTaskDto } from '../../src/task/dto/response/response-task-dto';
import { Project } from '../../src/project/entities/project.entity';
import { ResponseProjectDto } from '../../src/project/dto/response/response-project.dto';
import { ResponseUserDto } from '../../src/user/dto/response/response-user-dto';

@Injectable()
export class TimesheetService {
  @InjectRepository(Timesheet)
  private readonly timesheetRepository: Repository<Timesheet>;

  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  @InjectRepository(Project)
  private readonly projectRepository: Repository<Project>;

  async create(
    createTimesheetDto: CreateTimesheetDto,
  ): Promise<ResponseTimesheetDto | string> {
    try {
      const newTimesheet = await this.timesheetRepository.save(
        createTimesheetDto,
      );

      const responseTimesheet = plainToInstance(
        ResponseTimesheetDto,
        newTimesheet,
        {
          excludeExtraneousValues: true,
        },
      );
      const task = await this.taskRepository.findOne({
        where: {
          id: createTimesheetDto.taskId,
        },
      });
      responseTimesheet.taskName = task.name;

      return responseTimesheet;
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }

  async findAll(): Promise<ResponseTimesheetDto[] | string> {
    try {
      const taskList = await this.taskRepository.find({ relations: ['userId'] });

      const responseTimesheetList = [];
      for (const task of taskList) {
        const taskId: string = task.id;
        const userId: string = task.userId.id;

        const timesheet = await this.timesheetRepository
          .createQueryBuilder('timesheet')
          .where(`timesheet.taskId = :taskId`, { taskId })
          .getMany();

        const projects = await this.projectRepository
          .createQueryBuilder('project')
          .innerJoin('project.tasks', 'task')
          .where(`task.userId = "userId"`, { userId })
          .getOne();

        for (const item of timesheet) {
          const objTimesheet = {};
          objTimesheet['task'] = plainToInstance(ResponseTaskDto, task, {
            excludeExtraneousValues: true,
          });
          objTimesheet['project'] = plainToInstance(
            ResponseProjectDto,
            projects, { excludeExtraneousValues: true, },
          );
          objTimesheet['timesheet'] = plainToInstance(
            ResponseTimesheetDto,
            item,
            {
              excludeExtraneousValues: true,
            },
          );

          objTimesheet['user'] = plainToInstance(ResponseUserDto, task.userId, {
            excludeExtraneousValues: true,
          });

          responseTimesheetList.push(objTimesheet);
        }
      }

      return responseTimesheetList;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async getOwnTimesheet(user: any) {
    try {
      const userId: string = user.id;

      const taskList = await this.taskRepository
        .createQueryBuilder('task')
        .where(`task.userId = :userId`, { userId })
        .getMany();

      const timesheetList = [];
      for (const task of taskList) {
        const taskId: string = task.id;
        const timesheet = await this.timesheetRepository
          .createQueryBuilder('timesheet')
          .where(`timesheet.taskId = :taskId`, { taskId })
          .getMany();

        const projects = await this.projectRepository
          .createQueryBuilder('project')
          .innerJoin('project.tasks', 'task')
          .where(`task.userId = "userId"`, { userId })
          .getOne();

        for (const item of timesheet) {
          const objTimesheet = {};
          objTimesheet['task'] = plainToInstance(ResponseTaskDto, task, {
            excludeExtraneousValues: true,
          });
          objTimesheet['project'] = plainToInstance(
            ResponseProjectDto,
            projects, { excludeExtraneousValues: true, },
          );
          objTimesheet['timesheet'] = plainToInstance(
            ResponseTimesheetDto,
            item,
            {
              excludeExtraneousValues: true,
            },
          );
          timesheetList.push(objTimesheet);
        }
      }

      return timesheetList;
      // return null;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<ResponseTimesheetDto | string> {
    try {
      const timesheet = await this.timesheetRepository.findOne({
        where: {
          id: id,
        },
      });

      const task = await this.taskRepository.findOne({
        where: {
          id: timesheet.taskId,
        },
      });

      const responseTimesheet = plainToInstance(
        ResponseTimesheetDto,
        timesheet,
        {
          excludeExtraneousValues: true,
        },
      );
      responseTimesheet.taskName = task.name;

      return responseTimesheet;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async update(
    id: string,
    updateTimesheetDto: UpdateTimesheetDto,
  ): Promise<ResponseTimesheetDto | string> {
    try {
      const updateTimesheet = await this.timesheetRepository.findOne({
        where: {
          id: id,
        },
      });

      let taskName: string = '';

      if (updateTimesheetDto.taskId) {
        const updateTaskByTimesheet = await this.taskRepository.findOne({
          where: {
            id: updateTimesheetDto.taskId,
          },
        });
        taskName = updateTaskByTimesheet.name;
      } else {
        const task = await this.taskRepository.findOne({
          where: {
            id: updateTimesheet.taskId,
          },
        });
        taskName = task.name;
      }

      Object.assign(updateTimesheet, updateTimesheetDto);
      const updatedTimesheet = await this.timesheetRepository.save(
        updateTimesheet,
      );

      const responseTimesheet = plainToInstance(
        ResponseTimesheetDto,
        updatedTimesheet,
        {
          excludeExtraneousValues: true,
        },
      );
      responseTimesheet.taskName = taskName;

      return responseTimesheet;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async remove(id: string): Promise<DeleteTimesheetDto | string> {
    try {
      const deleteTimesheet = await this.timesheetRepository.findOne({
        where: {
          id: id,
        },
      });

      deleteTimesheet.isDeleted = true;
      deleteTimesheet.deletedAt = new Date();

      const deletedTimesheet = await this.timesheetRepository.save(
        deleteTimesheet,
      );
      const responseTimesheet = plainToInstance(
        DeleteTimesheetDto,
        deletedTimesheet,
        {
          excludeExtraneousValues: true,
        },
      );

      return responseTimesheet;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
