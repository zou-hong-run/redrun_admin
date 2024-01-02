import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  user_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nick_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱',
    },
  )
  email: string;

  @ApiProperty({
    minLength: 6,
  })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
