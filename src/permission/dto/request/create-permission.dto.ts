import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsString, IsUUID } from "class-validator";

export class CreatePermissionDto {
  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty()
  roleIds: string[];
}
