import { IsString, IsDate, IsUUID, IsArray } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { TaskStatusConstant } from '../../../common/constant/status.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @Expose()
  @IsString()
  @ApiProperty()
  name: string;

  @Expose()
  @IsString()
  @ApiProperty()
  description: string;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  requirement: Date;

  @Expose()
  @Transform(({ value }) => TaskStatusConstant[value], { toClassOnly: true })
  @ApiProperty()
  status: TaskStatusConstant

  @Expose()
  @IsUUID()
  @ApiProperty()
  projectId: string;

  @Expose()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @Expose()
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty()
  timesheetIds: string[];
}
