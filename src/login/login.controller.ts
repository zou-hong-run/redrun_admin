import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginParmDto } from './dto/login.dto';
import { AuthorizeOK } from 'src/common/decorators/authorize.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionOK } from 'src/common/decorators/permission.decorator';
import { Request } from 'express';

@ApiTags('登录模块')
@ApiBearerAuth()
@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({
    summary: '用户登录获取验证码',
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '用户名',
    required: true,
    example: 'xxxxx',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在',
    type: String,
  })
  @AuthorizeOK()
  @Get('/captcha')
  async captcha(@Query('username') username: string) {
    await this.loginService.getLoginCaptcha(username);
  }

  @ApiOperation({
    summary: '用户登录',
  })
  @ApiBody({
    type: LoginParmDto,
  })
  @AuthorizeOK()
  @Post('/login')
  async login(@Body() param: LoginParmDto) {
    let { access_token, refresh_token } = await this.loginService.login(param);
    return {
      access_token,
      refresh_token,
    };
  }

  @ApiOperation({
    summary: '刷新用户token获取新token',
  })
  @ApiQuery({
    name: 'refresh_token',
    description: '用于刷新的token',
    required: true,
  })
  @AuthorizeOK()
  @Get('/refresh')
  async refresh(@Query('refresh_token') refresh_token: string) {
    let data = await this.loginService.refresh_token(refresh_token);
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  @ApiOperation({
    summary: '获取用户权限菜单',
  })
  @PermissionOK()
  @Get('/getPermissionMenus')
  async getPermissionMenus(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.loginService.getPermissionMenus(user_id);
  }
}
