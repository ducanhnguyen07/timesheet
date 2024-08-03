import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../../decorator/customize';
import { UserLoginDto } from './dto/auth-login.dto';
import { RolesPermissionsGuard } from './guard/role-permission.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('v1/auth')
@ApiTags('auth')
@UseGuards(RolesPermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage('User login!')
  async handleLogin(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(userLoginDto, response);
  }

  @Public()
  @ResponseMessage('Get User by Refresh Token')
  @Get('refresh')
  async handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refreshToken'];
    console.log(request.cookies)
    if(!refreshToken) {
      throw new BadRequestException('Refresh token not exist!');
    }

    return this.authService.processNewToken(refreshToken, response);
  }
}