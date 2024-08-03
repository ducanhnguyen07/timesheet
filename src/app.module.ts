import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { DatabaseModule } from './database/database.module';
import { RequestModule } from './request/request.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfig } from './configs/throttler.config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './mail/email.module';
import { LoggerService } from './logging/log.service';
import { LoggingInterceptor } from './common/intercepter/logging.interceptor';


@Module({
  imports: [
    TaskModule,
    ProjectModule,
    UserModule,
    TimesheetModule,
    RoleModule,
    PermissionModule,
    DatabaseModule,
    RequestModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync(ThrottlerConfig),
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    JwtService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
