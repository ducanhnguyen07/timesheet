import { Expose, Transform } from "class-transformer"
import { IsString } from "class-validator"
import { RoleConstant } from "../../../common/constant/role.constant"
import { ApiProperty } from "@nestjs/swagger"

export class ResponseRoleDto {
  @Expose()
  @ApiProperty()
  id: string

  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @Expose()
  @Transform(({ value }) => RoleConstant[value], { toClassOnly: true })
  @ApiProperty()
  roleEnum: number
}