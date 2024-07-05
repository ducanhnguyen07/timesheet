import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/request/create-request.dto';
import { UpdateRequestDto } from './dto/request/update-request.dto';
import { ResponseRequestDto } from './dto/response/response-request-dto';
import { DeleteRequestDto } from './dto/response/delete-request.dto';
import { RolesPermissionsGuard } from '../auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('v1/requests')
@ApiTags('requests')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  @SetMetadata('permissions', ['request_create'])
  create(@Body() createRequestDto: CreateRequestDto): Promise<ResponseRequestDto | string> {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  @SetMetadata('permissions', ['request_read'])
  findAll(): Promise<ResponseRequestDto[] | string> {
    return this.requestService.findAll();
  }

  @Get(':id')
  @SetMetadata('permissions', ['request_read'])
  findOne(@Param('id') id: string): Promise<ResponseRequestDto | string> {
    return this.requestService.findOne(id);
  }

  @Patch('update/:id')
  @SetMetadata('permissions', ['request_update'])
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto): Promise<ResponseRequestDto | string> {
    return this.requestService.update(id, updateRequestDto);
  }

  @Patch('delete/:id')
  @SetMetadata('permissions', ['request_delete'])
  remove(@Param('id') id: string): Promise<DeleteRequestDto | string> {
    return this.requestService.remove(id);
  }
}
