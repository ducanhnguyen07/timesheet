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
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './mail/email.module';
import { LoggerService } from './logging/log.service';
import { LoggingInterceptor } from './common/intercepter/logging.interceptor';
import { RedisService } from './redis/redis.service';
import { KafkaModule } from './kafka/kafka.module';
import { DiscordService } from './discord/discord.service';
import { DiscordConsumer } from './kafka/discord.consumer';

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
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync(ThrottlerConfig),
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
    RedisService,
    DiscordService,
    DiscordConsumer,
  ],
})
export class AppModule {}
