import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';
import { ProjectModule } from '../project/project.module';
import { PaginationHelper } from '../helper/pagination.helper';
import { RoleModule } from '../role/role.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../configs/upload-multer.config';
import { MAILER_OPTIONS, MailerService } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TaskModule,
    ProjectModule,
    RoleModule,
    MulterModule.register(multerConfig),
  ],
  controllers: [UserController],
  providers: [UserService, PaginationHelper],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
