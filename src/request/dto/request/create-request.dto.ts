import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsNumber, IsString, IsUUID } from "class-validator";
import { RequestType } from "../../../common/constant/request-type.constant";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRequestDto {
  @Expose()
  @IsString()
  @ApiProperty()
  note: string

  @Expose()
  @Transform(({ value }) => RequestType[value], { toClassOnly: true })
  @ApiProperty()
  type: number

  @Expose()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  requestDay: Date

  @Expose()
  @IsNumber()
  @ApiProperty()
  time: number
}
