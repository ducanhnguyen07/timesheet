import { PartialType } from '@nestjs/mapped-types';
import { CreateTimesheetDto } from './create-timesheet.dto';
import { Expose, Transform } from 'class-transformer';
import { TimesheetStatusConstant } from '../../../common/constant/timesheet.constant';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {
  @Expose()
  @Transform(({ value }) => TimesheetStatusConstant[value], { toClassOnly: true })
  status: number

  @Expose()
  @IsString()
  note: string

  @Expose()
  @IsNumber()
  workingTime: number

  @Expose()
  @IsUUID('all', { each: true })
  taskId: string;
}
