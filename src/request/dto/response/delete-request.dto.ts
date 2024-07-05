import { Expose } from "class-transformer";
import { ResponseRequestDto } from "./response-request-dto";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteRequestDto extends ResponseRequestDto {
  @Expose()
  @ApiProperty()
  isDeleted: boolean
}