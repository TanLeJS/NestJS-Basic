import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post("/login")
    handleLogin(
      @Req() req,
      @Res({ passthrough: true }) response: Response
      ) {
      return this.authService.login(req.user, response);
    }
  
    @Public()
    @ResponseMessage("Register a user")
    @Post("/register")
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
      return this.authService.register(registerUserDto)
    }
}
