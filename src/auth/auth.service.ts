import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserLoginDto } from './dto/auth-login.dto';
import { RoleService } from '../role/role.service';
import 'winston-daily-rotate-file';
import { LoggerService } from '../../src/logging/log.service';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Request, Response } from 'express';
import { RedisService } from '../../src/redis/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserRegisterDto } from './dto/user-register.dto';
import { ResponseUserDto } from '../../src/user/dto/response/response-user-dto';
import { plainToInstance } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly loggerService: LoggerService,

    private configService: ConfigService,

    private readonly redisService: RedisService,

    private readonly mailerService: MailerService,
  ) {}

  async login(userLoginDto: UserLoginDto, response: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userLoginDto.email },
      });
      if (!user) {
        this.loggerService.logWarn('Invalid email');
        throw new UnauthorizedException('Invalid email');
      }

      if (
        !this.userService.isValidPassword(userLoginDto.password, user.password)
      ) {
        this.loggerService.logWarn('Invalid password');
        throw new UnauthorizedException('Invalid password');
      }

      const roles = await this.roleService.findRoleByUser(user.id);

      const payload = {
        sub: 'from server',
        iss: 'token login',
        id: user.id,
        email: user.email,
        roles: roles['roleEnum'],
        isActive: user.isActive,
      };
      const refreshToken = this.createRefreshToken(payload);

      const userId: string = user.id;
      this.updateUserRefreshToken(refreshToken, userId);

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      });

      this.loggerService.logInfo(`Success login by: ${payload.email}`);
      
      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: refreshToken,
      };
    } catch (error) {
      this.loggerService.logError('Error login');
      throw new BadRequestException(error.message);
    }
  }

  processNewToken = async (request: Request) => {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token not exist!');
    }

    const oldAccessToken = this.extractTokenFromHeader(request);
    if (!oldAccessToken) {
      throw new BadRequestException('Not authorize');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.userService.findUserByToken(refreshToken);
      if (user) {
        const roles = await this.roleService.findRoleByUser(user.id);
        const payload = {
          sub: 'from server',
          iss: 'token login',
          id: user.id,
          email: user.email,
          roles: roles['roleEnum'],
        };

        await this.redisService.setHash(
          'OLD_ACCESS_TOKEN',
          oldAccessToken,
          oldAccessToken,
        );

        const newAccessToken: string = await this.jwtService.signAsync(payload);
        return {
          accessToken: newAccessToken,
        };
      }
    } catch (error) {
      throw new BadRequestException(`Invalid refresh token!`);
    }
  };

  @Cron(CronExpression.EVERY_5_SECONDS, { name: 'Handle Expired Access Token' })
  async handleExpiredToken() {
    try {
      const oldAccessTokenList = await this.redisService.getAllHash(
        'OLD_ACCESS_TOKEN',
      );
      for (let i = 0; i < oldAccessTokenList.length; i++) {
        try {
          await this.jwtService.verifyAsync(oldAccessTokenList[i], {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          });
        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            await this.redisService.removeHashField(
              'OLD_ACCESS_TOKEN',
              oldAccessTokenList[i],
            );

            // oldAccessTokenList.splice(i, 1);
          } else {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async generate2FASecret(user: any) {
    try {
      const newUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      const otpAuthUrl = authenticator.keyuri(
        newUser.email,
        process.env.TWO_FACTOR_AUTHENTICATION,
        newUser.secretKey,
      );
      const qrCode: string = await toDataURL(otpAuthUrl);

      return {
        qrCode: qrCode,
        secretKey: newUser.secretKey,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async loginWith2FA(otp2FACode: string, user: any) {
    try {
      const loginUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (this.isOtp2FAValid(otp2FACode, loginUser)) {
        loginUser.isActive = true;
        await this.userRepository.save(loginUser);

        return {
          isActive: true,
          isLogin: true,
        };
      }

      return {
        isLogin: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async enable2FA(password: string, user: any) {
    try {
      const enableUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      if (!this.userService.isValidPassword(password, enableUser.password)) {
        return {
          isValid: false,
        };
      }

      let responseUser: any = {};

      if(!enableUser.isActive) {
        enableUser.isActive = true;
        const secretKey = authenticator.generateSecret();
        enableUser.secretKey = secretKey;
        responseUser = await this.userRepository.save(enableUser);
      }
      responseUser = await this.userRepository.save(enableUser);

      return {
        user: plainToInstance(ResponseUserDto, responseUser, {
          excludeExtraneousValues: true,
        }),
        isValid: true,
      };
    } catch (error) {
      console.log(error);
    }
  }

  isOtp2FAValid(otp2FA: string, user: any) {
    return authenticator.verify({
      token: otp2FA,
      secret: user.secretKey,
    });
  }

  async handleRegister(
    userRegisterDto: UserRegisterDto,
  ): Promise<ResponseUserDto> {
    try {
      const emailExist = userRegisterDto.email;
      const existedUser = await this.userRepository.findOne({
        where: {
          email: emailExist,
        } as FindOptionsWhere<User>,
      });

      if (existedUser) {
        throw new ConflictException('User already exists');
      }

      const roles = await this.roleRepository.find({
        where: {
          roleEnum: 0,
        } as FindOptionsWhere<Role>,
      });

      const hashedPassword = this.userService.getHashPassword(
        userRegisterDto.password,
      );

      const user = this.userRepository.create({
        ...userRegisterDto,
        password: hashedPassword,
        roles,
      });

      const registerUser = await this.userRepository.save(user);
      const responseUser = plainToInstance(ResponseUserDto, registerUser, {
        excludeExtraneousValues: true,
      });
      return responseUser;
    } catch (error) {
      console.log(error);
    }
  }

  createRefreshToken(payload: any): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  }

  async updateUserRefreshToken(refreshToken: string, id: string) {
    await this.userRepository.update(id, { refreshToken: refreshToken });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
