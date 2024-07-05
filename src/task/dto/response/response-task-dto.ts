import { IsString, IsDate, IsUUID } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { TaskStatusConstant } from '../../../common/constant/status.constant';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseTaskDto {
  @Expose()
  @IsUUID()
  @ApiProperty()
  id: string

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
  @ApiProperty()
  isDeleted: boolean

  @Expose()
  @IsUUID()
  projectId: string;

  @Expose()
  @IsUUID()
  userId: string;
}
