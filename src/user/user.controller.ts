import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  CacheTTL,
  Header,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ResponseUserDto } from './dto/response/response-user-dto';
import { ResponseTaskDto } from '../task/dto/response/response-task-dto';
import { RolesPermissionsGuard } from 'src/auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelFileConfig, FileConfig } from '../common/constant/upload-file.constant';
import { SkipThrottle } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RequestUser, ResponseMessage } from 'decorator/customize';
import { Response } from 'express';

@Controller('v1/users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SetMetadata('permissions', ['user_create'])
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('')
  @ResponseMessage('Find all user!')
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<ResponseUserDto[]> {
    return this.userService.findAll({ limit, page });
  }

  @SetMetadata('permissions', ['user_read'])
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseUserDto | string> {
    return this.userService.findOne(id);
  }

  @SetMetadata('permissions', ['user_update'])
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto | string> {
    return this.userService.update(id, updateUserDto);
  }

  @SetMetadata('permissions', ['user_delete'])
  @Patch('delete/:id')
  remove(@Param('id') id: string): Promise<ResponseUserDto | string> {
    return this.userService.deleteOne(id);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('projects/:id')
  findProject(@Param('id') id: string) {
    return this.userService.findProject(id);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('tasks/:id')
  findTask(@Param('id') id: string): Promise<ResponseTaskDto[] | string> {
    return this.userService.findTask(id);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('profile/info')
  @ResponseMessage('Get profile user!')
  getProfile(@RequestUser() user: any, @Query() query: any): Promise<ResponseUserDto | string> {
    return this.userService.getInfo(user);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('working-time/:id')
  @SkipThrottle({ default: true })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @ResponseMessage('Get working-time!')
  getWorkingTime(@Param('id') id: string): Promise<number | string> {
    return this.userService.getWorkingTime(id);
  }

  @SetMetadata('permissions', ['user_update'])
  @Post('upload-avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(new ParseFilePipe(FileConfig))
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(id, file);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('excels/export/all-users')
  @Header('Content-Type', 'text/xlsx')
  async exportExcel(@Res() res: Response) {
    const excelFile = await this.userService.exportExcelFile();
    res.download(`${excelFile}`);
  }

  @SetMetadata('permissions', ['user_read'])
  @Post('excels/import/all-users')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile(new ParseFilePipe(ExcelFileConfig))
    file: Express.Multer.File,
  ) {
    return this.userService.importExcelFile(file);
  }
}
