import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { CreateTimesheetDto } from './dto/request/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/request/update-timesheet.dto';
import { ResponseTimesheetDto } from './dto/response/response-timesheet-dto';
import { DeleteTimesheetDto } from './dto/response/delete-timesheet-dto';
import { RolesPermissionsGuard } from '../auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../../decorator/customize';

@Controller('v1/timesheets')
@ApiTags('timesheets')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class TimesheetController {
  constructor(
    private readonly timesheetService: TimesheetService,
  ) {}

  @Post('create')
  @SetMetadata('permissions', ['timesheet_create'])
  async create(@Body() createTimesheetDto: CreateTimesheetDto): Promise<ResponseTimesheetDto | string> {
    return this.timesheetService.create(createTimesheetDto);
  }

  @Get()
  @SetMetadata('permissions', ['timesheet_read'])
  findAll(): Promise<ResponseTimesheetDto[] | string>  {
    return this.timesheetService.findAll();
  }

  @Get('own-timesheet')
  @SetMetadata('permissions', ['user_read_own_timesheet'])
  getOwnTimesheet(@RequestUser() user: any)  {
    return this.timesheetService.getOwnTimesheet(user);
  }

  @Get(':id')
  @SetMetadata('permissions', ['timesheet_read'])
  findOne(@Param('id') id: string) {
    return this.timesheetService.findOne(id);
  }

  @Patch('update/:id')
  @SetMetadata('permissions', ['timesheet_approve'])
  update(@Param('id') id: string, @Body() updateTimesheetDto: UpdateTimesheetDto): Promise<ResponseTimesheetDto | string> {
    return this.timesheetService.update(id, updateTimesheetDto);
  }

  @Patch('delete/:id')
  @SetMetadata('permissions', ['timesheet_delete'])
  remove(@Param('id') id: string): Promise<DeleteTimesheetDto | string> {
    return this.timesheetService.remove(id);
  }
}
