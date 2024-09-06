import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, RequestUser, ResponseMessage } from '../../decorator/customize';
import { UserLoginDto } from './dto/auth-login.dto';
import { RolesPermissionsGuard } from './guard/role-permission.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GenerateCheckInTokenHelper } from 'src/helper/generateCheckInToken.helper';
import { ResponseUserDto } from 'src/user/dto/response/response-user-dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('v1/auth')
@ApiTags('auth')
@UseGuards(RolesPermissionsGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

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
  async handleRefreshToken(
    @Req() request: Request,
  ) {
    return this.authService.processNewToken(request);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @ResponseMessage('Two Factor Authentication')
  @Get('two-fa/url')
  async generate2FASecret(@RequestUser() user: any) {
    return this.authService.generate2FASecret(user);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Post('login/2fa')
  async loginWith2FA(@Body('otp2FACode') otp2FACode: string, @RequestUser() user: any) {
    return this.authService.loginWith2FA(otp2FACode, user);
  }

  @SetMetadata('permissions', ['user_read_own_timesheet'])
  @Post('enable/2fa')
  async enable2FA(@Body('password') password: string, @RequestUser() user: any) {
    return this.authService.enable2FA(password, user);
  }


  @Public()
  @Post('register')
  @ResponseMessage('User register!')
  async handleRegister(
    @Body() userRegisterDto: UserRegisterDto
  ): Promise<ResponseUserDto> {
    return this.authService.handleRegister(userRegisterDto);
  }
}
