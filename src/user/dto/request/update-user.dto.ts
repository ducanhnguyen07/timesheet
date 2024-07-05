import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { BranchConstant } from '../../../common/constant/branch.constant';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  isDeleted: boolean
}
