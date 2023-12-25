import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  nick_name: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
