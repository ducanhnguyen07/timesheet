import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { ResponseRoleDto } from './dto/response/response-role.dto';
import { ResponsePermissionDto } from '../permission/dto/response/response-permission.dto';
import { RolesPermissionsGuard } from 'src/auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('v1/roles')
@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @SetMetadata('permissions', ['role_create'])
  create(@Body() createRoleDto: CreateRoleDto): Promise<ResponseRoleDto | string> {
    return this.roleService.create(createRoleDto);
  }

  @Get('permissions/:id')
  @SetMetadata('permissions', ['role_read'])
  getPermissionByRoleId(@Param('id') id: string): Promise<ResponsePermissionDto[] | string> {
    return this.roleService.getPermissionByRoleId(id);
  }
}
