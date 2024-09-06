import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { ResponseRoleDto } from './dto/response/response-role.dto';
import { RolesPermissionsGuard } from '../../src/auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRolePermission } from '../../src/common/interface/role-permission.interface';
import { LoggerService } from '../../src/logging/log.service';
import { IUpdateRole } from '../../src/common/interface/update-role.interface';

@Controller('v1/roles')
@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Post('create')
  @SetMetadata('permissions', ['role_create'])
  create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseRoleDto | string> {
    return this.roleService.create(createRoleDto);
  }

  @Get('all-role')
  @SetMetadata('permissions', ['role_read'])
  getAllRole(): Promise<ResponseRoleDto[] | string> {
    return this.roleService.getAllRole();
  }

  @Get('permissions/:id')
  @SetMetadata('permissions', ['role_read'])
  getPermissionByRoleId(
    @Param('id') id: string,
  ): Promise<IRolePermission | string> {
    return this.roleService.getPermissionByRoleId(id);
  }

  @Post('role/change-permission')
  @SetMetadata('permissions', ['role_update'])
  changeRolePermission(@Body() updateRoleList: IUpdateRole[]) {
    return this.roleService.updateRoleList(updateRoleList);
  }

  @Get('role/role-permission')
  @SetMetadata('permissions', ['role_read'])
  getRoleUser() {
    return this.roleService.getRoleUser();
  }
}
