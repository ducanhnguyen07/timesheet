import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { ResponsePermissionDto } from './dto/response/response-permission.dto';
import { RolesPermissionsGuard } from '../auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('v1/permissions')
@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @SetMetadata('permissions', ['permisson_create'])
  create(@Body() createPermissionDto: CreatePermissionDto): Promise<ResponsePermissionDto | string> {
    return this.permissionService.create(createPermissionDto);
  }
}
