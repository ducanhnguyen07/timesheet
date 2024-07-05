import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateRoleDto {
  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @Expose()
  @IsNumber()
  @ApiProperty()
  roleEnum: number
}
