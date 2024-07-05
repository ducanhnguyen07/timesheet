import { Expose, Transform } from 'class-transformer';
import { TimesheetStatusConstant } from '../../../common/constant/timesheet.constant';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ResponseTimesheetDto {
  @Expose()
  @IsUUID()
  id: string

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
  taskName: string
}