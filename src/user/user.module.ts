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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from '../../src/discord/discord.service';
import { DiscordConsumer } from 'src/kafka/discord.consumer';
import { KafkaModule } from '../../src/kafka/kafka.module';
import { TimesheetModule } from '../../src/timesheet/timesheet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TaskModule,
    ProjectModule,
    RoleModule,
    TimesheetModule,
    MulterModule.register(multerConfig),
    // forwardRef(() => RoleModule),
    KafkaModule,
  ],
  controllers: [UserController],
  providers: [UserService, PaginationHelper, CloudinaryProvider, LoggerService, DiscordService, DiscordConsumer],
  // providers: [UserService, PaginationHelper, CloudinaryProvider, LoggerService, DiscordService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
