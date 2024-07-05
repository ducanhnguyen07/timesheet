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
import { Response } from 'express';
import { Role } from '../role/entities/role.entity';
import { UserLoginDto } from './dto/auth-login.dto';
import { RoleService } from '../role/role.service';

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
  ) {}

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (
      this.userService.isValidPassword(
        user.password,
        this.userService.getHashPassword(userLoginDto.password),
      )
    ) {
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
