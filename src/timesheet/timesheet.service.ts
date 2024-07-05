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

@Injectable()
export class TimesheetService {
  @InjectRepository(Timesheet)
  private readonly timesheetRepository: Repository<Timesheet>;

  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  async create(
    createTimesheetDto: CreateTimesheetDto,
  ): Promise<ResponseTimesheetDto | string> {
    try {
      const newTimesheet = await this.timesheetRepository.save(createTimesheetDto);

      const responseTimesheet = plainToInstance(ResponseTimesheetDto, newTimesheet, {
        excludeExtraneousValues: true
      });
      const task = await this.taskRepository.findOne({
        where: {
          id: createTimesheetDto.taskId
        }
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
      const timesheetList = await this.timesheetRepository.find({});

      const responseTimesheetList = timesheetList.map((timesheet) =>
        plainToInstance(ResponseTimesheetDto, timesheet, {
          excludeExtraneousValues: true,
        }),
      );
      
      return responseTimesheetList;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findOne(id: string): Promise<ResponseTimesheetDto | string> {
    try {
      const timesheet = await this.timesheetRepository.findOne({
        where: {
          id: id
        }
      });

      const task = await this.taskRepository.findOne({
        where: {
          id: timesheet.taskId
        }
      });

      const responseTimesheet = plainToInstance(ResponseTimesheetDto, timesheet, {
        excludeExtraneousValues: true
      });
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
          id: id
        }
      });

      let taskName: string = '';

      if(updateTimesheetDto.taskId) {
        const updateTaskByTimesheet = await this.taskRepository.findOne({
          where: {
            id: updateTimesheetDto.taskId
          }
        });
        taskName = updateTaskByTimesheet.name;
      } else {
        const task = await this.taskRepository.findOne({
          where: {
            id: updateTimesheet.taskId
          }
        });
        taskName = task.name;
      }

      Object.assign(updateTimesheet, updateTimesheetDto);
      const updatedTimesheet = await this.timesheetRepository.save(updateTimesheet);
      
      const responseTimesheet = plainToInstance(ResponseTimesheetDto, updatedTimesheet, {
        excludeExtraneousValues: true
      });
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
          id: id
        }
      });

      deleteTimesheet.isDeleted = true;
      deleteTimesheet.deletedAt = new Date();

      const deletedTimesheet = await this.timesheetRepository.save(deleteTimesheet);
      const responseTimesheet = plainToInstance(DeleteTimesheetDto, deletedTimesheet, {
        excludeExtraneousValues: true
      });

      return responseTimesheet;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
