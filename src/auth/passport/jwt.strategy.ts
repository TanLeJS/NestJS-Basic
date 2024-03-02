import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET")
    });
  }

  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;
    // cần gán thêm permissions
    const userRole = role as unknown as {_id: string; name: string}
    const temp = (await this.rolesService.findOne(userRole._id)).toObject()

    // req.user
    return {
    _id,
    name,
    email,
    role,
    permissions: temp?.permissions ??[]

    };
    }
}
