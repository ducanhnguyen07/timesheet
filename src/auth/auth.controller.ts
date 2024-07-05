import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, RequestUser } from '../../decorator/customize';
import { UserLoginDto } from './dto/auth-login.dto';
import { RolesPermissionsGuard } from './guard/role-permission.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/auth')
@ApiTags('auth')
@UseGuards(RolesPermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage('User login!')
  async handleLogin(
    @Body() userLoginDto: UserLoginDto
  ) {
    return this.authService.login(userLoginDto);
  }
}