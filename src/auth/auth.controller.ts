import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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
    handleLogin(@Request() req) {
      return this.authService.login(req.user);
    }
  
    @Public()
    @ResponseMessage("Register a user")
    @Post("/register")
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
      return this.authService.register(registerUserDto)
    }
}
