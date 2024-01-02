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
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { GetMenuVo } from './vo/getMenu.vo';

@Injectable()
export class LoginService {
  @Inject(UserService)
  private userService: UserService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(ConfigService)
  private configService: ConfigService<ConfigurationKeyPaths>;
  @Inject(RedisService)
  private redisService: RedisService;
  @Inject(EmailService)
  private emailService: EmailService;

  async login(param: LoginParmDto) {
    const captcha = await this.redisService.get(
      `login_captcha_${param.user_name}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已经失效了！', HttpStatus.BAD_REQUEST);
    }
    if (param.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

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

  async getLoginCaptcha(username: string) {
    let user = await this.userService.findUserByName(username);
    if (!user) {
      throw new HttpException('当前用户不存在', HttpStatus.BAD_REQUEST);
    }
    const code = Math.random().toString(36).slice(2, 8);
    await this.redisService.set(`login_captcha_${username}`, code, 5 * 60); // 五分钟过期
    try {
      await this.emailService.sendMail({
        to: user.email,
        subject: '注册验证码',
        html: `<h1>你好！</h1><hr><p>你的注册验证码是${code}</p>`,
      });
      return '发送成功';
    } catch (error) {
      throw new HttpException(`验证码发送失败${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getPermissionMenus(user_id: number) {
    let user = await this.userService.findUserById(user_id);
    let menuVo = new GetMenuVo();
    menuVo.menus = user.role.reduce((menuArr, item) => {
      item.menu.forEach((menu) => {
        // 去重
        if (menuArr.indexOf(menu) === -1) {
          menuArr.push(menu);
        }
      });
      return menuArr;
    }, []);
    return menuVo;
  }
}
