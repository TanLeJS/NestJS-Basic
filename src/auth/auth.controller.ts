import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public, ResponseMessage, currentUser } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from 'src/users/users.interface';
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

    @ResponseMessage("Refresh a user")
    @Get("/account")
    handleGetAccount(@currentUser() user: IUser) {
      return {user}
    }

    @Public()
    @ResponseMessage("Get User Refresh Token")
    @Get("/refresh")
    handleRefreshToken(
    @Req() request: Request,  
    @Res({ passthrough: true }) response: Response
    ) 
    {
      const refresh_token = request.cookies["refresh_token"]
      return this.authService.processNewToken(refresh_token, response)

}
}
