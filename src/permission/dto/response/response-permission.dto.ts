import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ResponsePermissionDto {
  @Expose()
  id: string

  @Expose()
  name: string
}