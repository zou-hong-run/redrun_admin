import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginParmDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  user_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
