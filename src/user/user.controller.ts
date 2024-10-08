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
  Header,
  Res,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ResponseUserDto } from './dto/response/response-user-dto';
import { ResponseTaskDto } from '../task/dto/response/response-task-dto';
import { RolesPermissionsGuard } from '../../src/auth/guard/role-permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ExcelFileConfig,
  FileConfig,
} from '../common/constant/upload-file.constant';
import { SkipThrottle } from '@nestjs/throttler';
import { Public, RequestUser, ResponseMessage } from '../../decorator/customize';
import { Response } from 'express';
import { multerConfig } from '../../src/configs/upload-multer.config';
import { LoggerService } from '../../src/logging/log.service';

@Controller('v1/users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(RolesPermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
  ) {}

  @SetMetadata('permissions', ['user_create'])
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('')
  @ResponseMessage('Find all user!')
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    this.loggerService.logInfo('Find all user');
    return this.userService.findAll({ limit, page });
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('all-users')
  @ResponseMessage('Find user list')
  getUserList() {
    return this.userService.getAll();
  }

  @SetMetadata('permissions', ['user_read'])
  @SkipThrottle({ default: true })
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

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Get('role/own-permission')
  @ResponseMessage('Get own permission')
  getOwnPermission(@RequestUser() user: any) {
    return this.userService.getOwnPermission(user);
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

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Get('profile/info')
  @ResponseMessage('Get profile user!')
  getProfile(
    @RequestUser() user: any,
    @Query() query: any,
  ): Promise<ResponseUserDto | string> {
    return this.userService.getInfo(user);
  }

  @SetMetadata('permissions', ['user_read'])
  @Get('working-time/:id')
  @SkipThrottle({ default: true })
  @ResponseMessage('Get working-time!')
  getWorkingTime(@Param('id') id: string): Promise<number | string> {
    return this.userService.getWorkingTime(id);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Get('working-time/my-working-time/get-time')
  @ResponseMessage('Get own working-time!')
  getOwnWorkingTime(@RequestUser() user: any): Promise<number> {
    return this.userService.getOwnWorkingTime(user);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @RequestUser() user: any,
    @UploadedFile(new ParseFilePipe(FileConfig))
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(user, file);
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
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async importExcel(
    @UploadedFile(new ParseFilePipe(ExcelFileConfig))
    file: Express.Multer.File,
  ) {
    return this.userService.importExcelFile(file);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Post('attend/check-in')
  @ResponseMessage('Handle check in')
  async handleCheckIn(
    @RequestUser() user: any,
    @Body('checkInToken') checkInToken: string,
  ) {
    return this.userService.handleCheckIn(user, checkInToken);
  }

  @Public()
  @Get('attend/reset')
  @ResponseMessage('Reset check in')
  async handleResetCheckIn() {
    return this.userService.handleResetCheckIn();
  }

  /* Test */
  @Public()
  @Get('/test-server/host')
  async testServer() {
    return 200;
  }
}
