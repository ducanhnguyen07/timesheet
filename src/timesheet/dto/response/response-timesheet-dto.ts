import { Expose, Transform } from 'class-transformer';
import { StatusConstant } from '../../../../src/common/constant/status.constant';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ResponseTimesheetDto {
  @Expose()
  @IsUUID()
  id: string

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
  taskName: string
}