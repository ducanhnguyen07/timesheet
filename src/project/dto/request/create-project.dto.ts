import { Expose, Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { ProjectStatusConstant } from "../../../common/constant/status.constant";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
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
