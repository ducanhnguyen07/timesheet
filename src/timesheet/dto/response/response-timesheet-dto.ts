import { Expose, Transform, Type } from 'class-transformer';
import { StatusConstant } from '../../../../src/common/constant/status.constant';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseTimesheetDto {
  @Expose()
  @IsUUID()
  @ApiProperty()
  id: string

  @Expose()
  @Transform(({ value }) => StatusConstant[value], { toClassOnly: true })
  @ApiProperty()
  status: number

  @Expose()
  @IsString()
  @ApiProperty()
  note: string

  @Expose()
  @IsNumber()
  @ApiProperty()
  workingTime: number

  @Expose()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  logTime: Date

  @Expose()
  @ApiProperty()
  taskName: string
}