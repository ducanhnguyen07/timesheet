import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ProjectStatusConstant } from '../../../common/constant/status.constant';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @Expose()
  @IsString()
  @ApiProperty()
  description: string

  @Expose()
  @IsNumber()
  @ApiProperty()
  budget: number

  @Expose()
  @Transform(({ value }) => ProjectStatusConstant[value], { toClassOnly: true })
  @ApiProperty()
  status: ProjectStatusConstant
}
