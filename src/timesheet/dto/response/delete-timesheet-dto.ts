import { Expose, Transform } from "class-transformer";
import { TimesheetStatusConstant } from "../../../common/constant/timesheet.constant";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class DeleteTimesheetDto {
  @Expose()
  @IsUUID('all', { each: true })
  id: string;

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
  isDeleted: boolean

  @Expose()
  @IsUUID('all', { each: true })
  taskId: string;
}