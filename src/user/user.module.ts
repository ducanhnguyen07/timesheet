import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { PaginationHelper } from '../helper/pagination.helper';
import { RoleModule } from '../role/role.module';
import { CloudinaryProvider, multerConfig } from '../../src/configs/upload-multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { LoggerService } from '../../src/logging/log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TaskModule,
    ProjectModule,
    RoleModule,
    MulterModule.register(multerConfig),
    // forwardRef(() => RoleModule),
  ],
  controllers: [UserController],
  providers: [UserService, PaginationHelper, CloudinaryProvider, LoggerService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
