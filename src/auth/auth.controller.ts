import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public, ResponseMessage, currentUser } from 'src/decorator/customize';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from 'src/users/users.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
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
    async handleGetAccount(@currentUser() user: IUser) {
      const temp = await this.roleService.findOne(user.role._id) as any;
      user.permissions = temp.permissions;
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

    @ResponseMessage("Log out user sucessfully")
    @Post("/logout")
    handleLogOut (
      @Res({ passthrough: true }) response: Response, 
      @currentUser() user: IUser,
      ) {
      return this.authService.logout(response, user)
    }
}
