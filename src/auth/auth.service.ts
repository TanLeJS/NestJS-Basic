import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService  {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleService: RolesService
        ) {}
    //username/password là 2 tham số thư viện passport trả về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOnebyUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass,user.password)
            if (isValid === true){
                const userRole = user.role as unknown as {_id: string; name: string}
                const temp = await this.roleService.findOne(userRole._id)
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ??[]
                }
                return objUser
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role,
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
            role,
            permissions
        },
        };
}
    async register(user: RegisterUserDto){
        const newUser = await this.usersService.register(user)
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

    processNewToken = async (refresh_token: string, response: Response) => {
        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
            let user = await this.usersService.findUserByToken(refresh_token)
            if (user) {
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
            await this.usersService.updateUserToken(refresh_token, _id.toString())
            // fetch user role
            const userRole = user.role as unknown as {_id: string; name: string}
            const temp = await this.roleService.findOne(userRole._id)
            //set refresh_token as cookie
            response.clearCookie('refresh_token')

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
                role,
                permissions: temp?.permissions ??[]
            },
            };
            } else {
                throw new BadRequestException(`Refresh Token không hợp lệ. Vui lòng đăng nhập lại`)
            }
            
        } catch (error) {
            throw new BadRequestException(`Refresh Token không hợp lệ. Vui lòng đăng nhập lại`)
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id)
        response.clearCookie('refresh_token')
        return "ok"
    }

}
