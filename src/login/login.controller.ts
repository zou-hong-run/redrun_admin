import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginParmDto } from './dto/login.dto';
import { AuthorizeOK } from 'src/common/decorators/authorize.decorator';

@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 获取验证码
   * @param address
   * @returns
   */
  @AuthorizeOK()
  @Get('/captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString(36).slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60); // 五分钟过期
    try {
      await this.emailService.sendMail({
        to: address,
        subject: '注册验证码',
        html: `<h1>你好！</h1><hr><p>你的注册验证码是${code}</p>`,
      });
      return '发送成功';
    } catch (error) {
      throw new HttpException(`验证码发送失败${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  @AuthorizeOK()
  @Post('/login')
  async login(@Body() param: LoginParmDto) {
    let { access_token, refresh_token } = await this.loginService.login(param);
    return {
      access_token,
      refresh_token,
    };
  }

  @AuthorizeOK()
  @Get('/refresh')
  async refresh(@Query('refresh_token') refresh_token: string) {
    let data = await this.loginService.refresh_token(refresh_token);
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }
}
