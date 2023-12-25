import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginParmDto } from './dto/login.dto';
import { md5 } from 'src/utils/common';
import { UserService } from 'src/system/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationKeyPaths } from 'src/config/configuration';

@Injectable()
export class LoginService {
  @Inject(UserService)
  private userService: UserService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(ConfigService)
  private configService: ConfigService<ConfigurationKeyPaths>;

  async login(param: LoginParmDto) {
    const user = await this.userService.findUserByName(param.user_name);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(param.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const access_token = this.jwtService.sign(
      {
        user_id: user.id,
      },
      {
        expiresIn: this.configService.get<string>('jwt.access_token') || '30m',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        user_id: user.id,
      },
      {
        expiresIn: this.configService.get<string>('jwt.refresh_token') || '30m',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh_token(refresh_token: string) {
    try {
      const { user_id } = this.jwtService.verify<{ user_id: number }>(
        refresh_token,
      );
      const user = await this.userService.findUserById(user_id);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      const access_token = this.jwtService.sign(
        {
          user_id: user.id,
        },
        {
          expiresIn:
            this.configService.get<string>('jwt.access_token') || '30m',
        },
      );
      refresh_token = this.jwtService.sign(
        {
          user_id: user.id,
        },
        {
          expiresIn:
            this.configService.get<string>('jwt.refresh_token') || '30m',
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token失效，请重新登录');
    }
  }
}
