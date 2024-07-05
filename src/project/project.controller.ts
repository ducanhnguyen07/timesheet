import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/request/create-project.dto';
import { UpdateProjectDto } from './dto/request/update-project.dto';
import { ResponseProjectDto } from './dto/response/response-project.dto';
import { RolesPermissionsGuard } from '../auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('v1/projects')
@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @SetMetadata('permissions', ['project_create'])
  create(@Body() createProjectDto: CreateProjectDto): Promise<ResponseProjectDto | string> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @SetMetadata('permissions', ['project_read'])
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @SetMetadata('permissions', ['project_read'])
  findOne(@Param('id') id: string): Promise<ResponseProjectDto | string> {
    return this.projectService.findOne(id);
  }

  @Patch('update/:id')
  @SetMetadata('permissions', ['project_update'])
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<ResponseProjectDto | string> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch('delete/:id')
  @SetMetadata('permissions', ['project_delete'])
  remove(@Param('id') id: string): Promise<ResponseProjectDto | string> {
    return this.projectService.remove(id);
  }
}
