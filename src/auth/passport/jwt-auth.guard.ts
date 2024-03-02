import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context :ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ / Không có Bearer token ở header request');
    }
    // check permisisons:
    const targetMethod = request.method
    const targetEndpoint = request.route?.path
    const permissisons = user?.permissions ?? []
    const isExist = permissisons.find(permisison => 
      targetMethod === permisison.method
      &&
      targetEndpoint === permisison.apiPath
      )
      if (!isExist){
        throw new ForbiddenException("không có quyền truy cập endpoint này")
      }
    return user;
  }
}
