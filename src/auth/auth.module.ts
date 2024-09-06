import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../src/auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import ms from 'ms';
import { RoleModule } from '../role/role.module';
import { LoggerService } from '../../src/logging/log.service';
import { GenerateCheckInTokenHelper } from '../../src/helper/generateCheckInToken.helper';
import { RedisService } from '../../src/redis/redis.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE'))/1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoggerService,
    GenerateCheckInTokenHelper,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
