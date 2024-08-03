import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserLoginDto } from './dto/auth-login.dto';
import { RoleService } from '../role/role.service';
import 'winston-daily-rotate-file';
import { LoggerService } from '../../src/logging/log.service';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

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

  processNewToken = async (refreshToken: string, response: Response) => {
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
        
        const refreshToken: string = this.createRefreshToken(payload);

        const userId: string = user.id;
        this.updateUserRefreshToken(refreshToken, userId);

        response.clearCookie('refreshToken');
      
        response.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          accessToken: await this.jwtService.signAsync(payload),
          refreshToken: refreshToken,
        };
      }
    } catch (error) {
      throw new BadRequestException(`Invalid refresh token!`);
    }
  };

  createRefreshToken = (payload: any): string => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))/1000,
    });
    return refreshToken;
  };

  updateUserRefreshToken = async (refreshToken: string, id: string) => {
    await this.userRepository.update(id, { refreshToken: refreshToken });
  };
}
