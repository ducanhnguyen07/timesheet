import { Expose, Transform } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsString, IsUUID } from "class-validator";
import { BranchConstant } from "../../../common/constant/branch.constant";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @Expose()
  @IsString()
  @ApiProperty()
  name: string

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string

  @Expose()
  @IsString()
  @ApiProperty()
  password: string

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
  @ApiProperty()
  branch: BranchConstant

  @Expose()
  @ApiProperty()
  role: number;
}
