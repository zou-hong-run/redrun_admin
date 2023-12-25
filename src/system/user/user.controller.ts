import { Controller, Get, Post, Body, Req, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { UserInfoVo } from './vo/user-info.vo';
import { PermissionOK } from 'src/common/decorators/permission.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建新用户
   * @param createUserDto
   * @returns
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/init-data')
  async initData() {
    await this.userService.initData();
    return '初始化成功';
  }

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

  @Patch('/update_password')
  async updatePassword(@Req() req: Request, @Body() param: UpdatePasswordDto) {
    let user_id = req.user.user_id;
    return await this.userService.updatePassword(user_id, param);
  }

  @PermissionOK()
  @Get('/update_password_captcha')
  async updatePasswordCaptcha(@Req() req: Request) {
    let user_id = req.user.user_id;
    return await this.userService.getUpdatePasswordCaptcha(user_id);
  }
}
