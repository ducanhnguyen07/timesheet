import { PartialType } from '@nestjs/mapped-types';
import { CreateTimesheetDto } from './create-timesheet.dto';
import { Expose, Transform } from 'class-transformer';
import { StatusConstant } from '../../../../src/common/constant/status.constant';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {
  @Expose()
  @Transform(({ value }) => StatusConstant[value], { toClassOnly: true })
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
