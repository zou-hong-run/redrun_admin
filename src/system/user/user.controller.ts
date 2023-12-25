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
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { UserInfoVo } from './vo/user-info.vo';
import { PermissionOK } from 'src/common/decorators/permission.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/common/pipes/my-parseint.pipe';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '创建新用户',
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
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '初始化用户数据',
  })
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
    let vo = new UserInfoVo();
    vo.id = user.id;
    vo.nick_name = user.nick_name;
    vo.user_name = user.user_name;
    vo.email = user.email;
    vo.phone_number = user.phone_number;
    vo.avatar = user.avatar;
    vo.create_time = user.create_time;
    // 角色 菜单 部门 岗位
    // vo.roles = user.role.map((item) => item.role_name);
    // vo.perms = user.role.reduce((arr, item) => {
    //   item.menu.forEach((menu) => {
    //     // 去重
    //     if (arr.indexOf(menu.perms) === -1) {
    //       arr.push(menu.perms);
    //     }
    //   });
    //   return arr;
    // }, []);
    vo.depts = user.role.reduce((arr, item) => {
      item.dept.forEach((dept) => {
        // 去重
        if (arr.indexOf(dept.dept_name) === -1) {
          arr.push(dept.dept_name);
        }
      });
      return arr;
    }, []);
    vo.posts = user.post.map((item) => item.post_name);
    return vo;
  }

  @ApiOperation({
    summary: '根据条件获取用户列表',
  })
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条数据',
  })
  @ApiQuery({
    name: 'userName',
    description: '用户名模糊查询',
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称模糊查询',
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱模糊查询',
  })
  @Get('list')
  async getUserInfoList(
    @Query('pageNo', generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query('pageSize', generateParseIntPipe('pageSize'))
    pageSize: number,
    @Query('userName')
    username: string,
    @Query('nickName')
    nickName: string,
    @Query('email')
    email: string,
  ) {
    if (pageNo <= 0) {
      throw new HttpException('pageNo不能小于1！！！', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.findUserByPage(
      pageNo,
      pageSize,
      email,
      username,
      nickName,
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
  @Get('/create_captcha')
  async createUserCaptcha(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.userService.getCreateUserCaptcha(user_id);
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
