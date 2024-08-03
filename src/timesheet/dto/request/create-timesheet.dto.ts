import { Expose, Transform } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";
import { StatusConstant } from "../../../../src/common/constant/status.constant";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTimesheetDto {
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
  @IsUUID('all', { each: true })
  @ApiProperty()
  taskId: string;
}
