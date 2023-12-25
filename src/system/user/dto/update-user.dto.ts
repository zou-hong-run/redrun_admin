import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  user_name: string;

  nick_name: string;

  avatar: string;

  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
