import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetController } from './timesheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet]), TaskModule],
  controllers: [TimesheetController],
  providers: [TimesheetService],
  exports: [TimesheetService, TypeOrmModule.forFeature([Timesheet])],
})
export class TimesheetModule {}
