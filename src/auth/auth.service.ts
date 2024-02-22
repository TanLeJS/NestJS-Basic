import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService  {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        ) {}
    //username/password là 2 tham số thư viện passport trả về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOnebyUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass,user.password)
            if (isValid === true){
                return user
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role
        };
        const refresh_token = this.createRefreshToken(payload)
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id)
        //set refresh_token as cookie

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) // millisecond
        })

        return {
        access_token: this.jwtService.sign(payload),
        users: {
            _id,
            name,
            email,
            role
        },
        };
}
    async register(user: RegisterUserDto){
        let newUser = await this.usersService.register(user)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    createRefreshToken = (payload: any) => {
        const refresh_token =  this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        })
        return refresh_token
    }

    processNewToken = (refresh_token: string) => {
        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
        } catch (error) {
            throw new BadRequestException(`Refresh Token không hợp lệ. Vui lòng đăng nhập lại`)
        }
    }
}
