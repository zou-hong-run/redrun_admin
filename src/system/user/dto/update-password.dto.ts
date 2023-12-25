import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  password: string;
}
