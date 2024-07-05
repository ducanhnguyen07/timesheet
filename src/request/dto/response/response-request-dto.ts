import { Expose, Transform } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";
import { RequestType } from "../../../common/constant/request-type.constant";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseRequestDto {
  @Expose()
  @IsUUID('all', { each: true })
  @ApiProperty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  note: string

  @Expose()
  @Transform(({ value }) => RequestType[value], { toClassOnly: true })
  @ApiProperty()
  type: number

  @Expose()
  @IsNumber()
  @ApiProperty()
  time: number

  @Expose()
  @IsUUID('all', { each: true })
  @ApiProperty()
  timesheetId: string
}