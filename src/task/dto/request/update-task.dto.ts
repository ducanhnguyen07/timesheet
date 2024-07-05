import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
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
  @IsUUID()
  @ApiProperty()
  projectId: string;

  @Expose()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  isDeleted: boolean
}
