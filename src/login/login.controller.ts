import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

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
}
