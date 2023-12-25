import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTHORIZE_OK } from '../constants/authorize.constants';
import { PERMISSION_OK } from '../constants/permission.constans';
import { UserService } from 'src/system/user/user.service';

export interface verifyTokenData {
  user_id: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(UserService)
  private userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    let path = request.url;

    // 使用注解，表示已经授权了，可以比如获取验证码不需要授权
    const authorize_ok = this.reflector.getAllAndOverride<boolean>(
      AUTHORIZE_OK,
      [context.getClass(), context.getHandler()],
    );
    if (authorize_ok) {
      return true;
    }
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('用户尚未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const { user_id } = this.jwtService.verify<verifyTokenData>(token);
      request.user = {
        user_id,
      };
    } catch (error) {
      throw new UnauthorizedException('token失效，请重新登录');
    }

    // 使用该注解，表示不需要权限，直接放行
    const permission_ok = this.reflector.getAllAndOverride<boolean>(
      PERMISSION_OK,
      [context.getClass(), context.getHandler()],
    );
    if (permission_ok) {
      return true;
    }

    let user = await this.userService.findUserById(request.user.user_id);
    const perms = user.role.reduce((arr, item) => {
      let menu = item.menu;
      menu.forEach((item) => {
        if (arr.indexOf(item.perms) === -1) {
          arr.push(item.perms);
        }
      });
      return arr;
    }, [] as string[]);

    if (perms.length === 0) {
      throw new HttpException(
        '权限不够，无法访问',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    const permArray = perms.map((perm) => {
      return perm.replace(/:/g, '/');
    });
    if (!permArray.includes(path)) {
      throw new HttpException(
        '权限不够，无法访问',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    return true;
  }
}
