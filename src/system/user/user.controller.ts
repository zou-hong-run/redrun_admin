import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { UserInfoVo } from './vo/user-info.vo';
import { PermissionOK } from 'src/common/decorators/permission.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/common/pipes/my-parseint.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeOK } from 'src/common/decorators/authorize.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('用户管理模块')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '创建用户',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '创建用户失败',
    type: String,
  })
  @Post('/create')
  create(@Body() createUserdto: CreateUserDto) {
    return this.userService.create(createUserdto);
  }

  @ApiOperation({
    summary: '注册新用户',
  })
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '注册用户失败',
    type: String,
  })
  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({
    summary: '初始化用户数据',
  })
  @AuthorizeOK()
  @Get('/init-data')
  async initData() {
    await this.userService.initData();
    return '初始化成功';
  }

  @ApiOperation({
    summary: '获取单个用户信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserInfoVo,
  })
  @PermissionOK()
  @Get('info')
  async getUserInfo(@Req() req: Request) {
    let { user_id } = req.user;
    let user = await this.userService.findUserById(user_id);
    let roles = user.role;
    let depts = user.role.reduce((arr, item) => {
      item.dept.forEach((dept) => {
        // 去重
        if (arr.indexOf(dept) === -1) {
          arr.push(dept);
        }
      });
      return arr;
    }, []);
    let perms = user.role.reduce((arr, item) => {
      item.menu.forEach((menu) => {
        // 去重
        if (arr.indexOf(menu.perms) === -1) {
          arr.push(menu.perms);
        }
      });
      return arr;
    }, []);
    let vo = new UserInfoVo();
    vo.id = user.id;
    vo.nick_name = user.nick_name;
    vo.user_name = user.user_name;
    vo.email = user.email;
    vo.phone_number = user.phone_number;
    vo.avatar = user.avatar;
    vo.create_time = user.create_time;
    // 角色 菜单 部门 岗位
    vo.roles = roles.map((item) => {
      item.dept = null;
      item.menu = null;
      return item;
    });
    vo.perms = perms;
    vo.depts = depts;
    vo.posts = user.post;
    return vo;
  }

  @ApiOperation({
    summary: '根据条件获取用户列表',
  })
  @ApiQuery({
    name: 'page_no',
    description: '第几页',
  })
  @ApiQuery({
    name: 'page_size',
    description: '每页多少条数据',
  })
  @ApiQuery({
    name: 'user_name',
    description: '用户名模糊查询',
  })
  @ApiQuery({
    name: 'nick_name',
    description: '昵称模糊查询',
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱模糊查询',
  })
  @ApiQuery({
    name: 'dept_id',
    description: '部门id',
  })
  @Get('list')
  async getUserInfoList(
    @Query('page_no', generateParseIntPipe('page_no'))
    page_no: number,
    @Query('page_size', generateParseIntPipe('page_size'))
    page_size: number,
    @Query('user_name')
    user_name: string,
    @Query('nick_name')
    nick_name: string,
    @Query('email')
    email: string,
    @Query('dept_id')
    dept_id: number,
  ) {
    if (page_no <= 0) {
      throw new HttpException('page_no不能小于1！！！', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.findUserByPage(
      page_no,
      page_size,
      email,
      user_name,
      nick_name,
      dept_id,
    );
  }

  @ApiOperation({
    summary: '更改用户密码',
  })
  @ApiBody({
    type: UpdatePasswordDto,
  })
  @Patch('/update_password')
  async updatePassword(@Req() req: Request, @Body() param: UpdatePasswordDto) {
    let user_id = req.user.user_id;
    return await this.userService.updatePassword(user_id, param);
  }

  @ApiOperation({
    summary: '更改用户信息',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @Patch('/update_info')
  async updateInfo(@Req() req: Request, @Body() param: UpdateUserDto) {
    let user_id = req.user.user_id;
    return await this.userService.updateUserInfo(user_id, param);
  }

  @ApiOperation({
    summary: '获取创建新用户验证码',
  })
  @PermissionOK()
  @Get('/register_captcha')
  async registerUserCaptcha(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.userService.getRegisterUserCaptcha(user_id);
  }

  @ApiOperation({
    summary: '获取更改密码验证码',
  })
  @PermissionOK()
  @Get('/update_password_captcha')
  async updatePasswordCaptcha(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.userService.getUpdatePasswordCaptcha(user_id);
  }

  @ApiOperation({
    summary: '获取更改用户信息验证码',
  })
  @PermissionOK()
  @Get('/update_user_captcha')
  async updateUserCaptcha(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.userService.getUpdateUserCaptcha(user_id);
  }
}
