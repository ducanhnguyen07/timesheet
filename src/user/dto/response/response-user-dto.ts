import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { BranchConstant } from "../../../common/constant/branch.constant";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseUserDto {
  @Expose()
  @IsString()
  @ApiProperty()
  id: string

  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @Expose()
  @IsString()
  @ApiProperty()
  @IsEmail()
  email: string

  @Expose()
  @IsString()
  @ApiProperty()
  address: string

  @Expose()
  @IsString()
  @ApiProperty()
  gender: string

  @Expose()
  @IsEnum(BranchConstant)
  @Transform(({ value }) => BranchConstant[value], { toClassOnly: true })
  branch: BranchConstant

  @Expose()
  isDeleted: boolean

  @Expose()
  @IsString()
  @ApiProperty()
  avatar: string
}
